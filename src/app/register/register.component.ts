import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Page } from '@nativescript/core';
import { Toasty } from '@triniwiz/nativescript-toasty';
import * as Firebase from '@nativescript/firebase/app'
import { RouterExtensions } from '@nativescript/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ns-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

  form: FormGroup
  bmiValue: number = 0
  bmrValue: number = 0

  constructor(
    private page: Page,
    private fb: FormBuilder,
    private router: RouterExtensions,
    private http: HttpClient
  ) {
    this.page.actionBarHidden = true;
    this.form = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
      confirm_password: [null, Validators.required],
      usia: [null, Validators.required],
      tinggi: [null, Validators.required],
      berat: [null, Validators.required],
      jenis_kelamin: ['Laki-laki', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  onChange(name: any, event: any) {
    this.form.get(name).setValue(event.object.text)
    if (name == 'tinggi' || name == 'berat' || name == 'usia') {
      const tinggi = this.form.get('tinggi').value
      const berat = this.form.get('berat').value
      const usia = this.form.get('usia').value
      if (tinggi && berat) {
        this.http.post('https://diabetes-bmir.herokuapp.com/api/bmi', {berat, tinggi}).subscribe((data: any) => {
          this.bmiValue = (data.result).toFixed(2)
          // this.bmiValue = parseFloat((berat / ((tinggi / 100) * (tinggi/100))).toFixed(2))
          if (usia) {
            this.http.post('https://diabetes-bmir.herokuapp.com/api/bmr', {bmi: this.bmiValue, umur: usia}).subscribe((data: any) => {
              this.bmrValue = (data.result).toFixed(2)
            })
            // if (this.form.get('jenis_kelamin').value == 'Laki-laki') {
            //   this.bmrValue = (13.397 * berat) + (4.799 * tinggi) - (5.677 * usia) + 88.362
            // } else {
            //   this.bmrValue = (9.247 * berat) + (3.098 * tinggi) - (4.330 * usia) + 447.593
            // }
            // this.bmrValue = parseInt(this.bmrValue.toFixed(0))
          }
        })
      } else {
        this.bmiValue = 0
        this.bmrValue = 0
      }
    }
  }

  changeJenisKelamin(data: string) {
    this.form.get('jenis_kelamin').setValue(data)
    const tinggi = this.form.get('tinggi').value
    const berat = this.form.get('berat').value
    const usia = this.form.get('usia').value
    if (tinggi && berat) {
      this.bmiValue = parseFloat((berat / ((tinggi / 100) * (tinggi/100))).toFixed(2))
      if (usia) {
        if (this.form.get('jenis_kelamin').value == 'Laki-laki') {
          this.bmrValue = (13.397 * berat) + (4.799 * tinggi) - (5.677 * usia) + 88.362
        } else {
          this.bmrValue = (9.247 * berat) + (3.098 * tinggi) - (4.330 * usia) + 447.593
        }
        this.bmrValue = parseInt(this.bmrValue.toFixed(0))
      }
    }
  }

  submit() {
    if (this.form.valid) {
      const toast = new Toasty({text: "Registering..."})
      toast.show()
      const data = this.form.value
      data.berat = parseFloat(data.berat)
      data.tinggi = parseFloat(data.tinggi)
      data.usia = parseFloat(data.usia)
      data.bmi = this.bmiValue
      data.bmr = this.bmrValue
      if (data.password != data.confirm_password) {
        const toast = new Toasty({text: "Password konfirmasi tidak cocok!"})
        toast.show()
      } else {
        Firebase.firestore().collection('users').where('username', '==', data.username).get()
          .then((resp) => {
            if (resp.docSnapshots.length) {
              const toast = new Toasty({text: "Username telah digunakan!"})
              toast.show()
            } else {
              delete data.confirm_password
              Firebase.firestore().collection('users').add(data)
                .then((resp) => {
                  resp.get().then((result) => {
                    console.log(result.data())
                    toast.cancel()
                    Firebase.firestore().collection('history').add({
                      userId: result.id,
                      timestamp: new Date(),
                      tinggi: data.tinggi,
                      berat: data.berat,
                      bmi: data.bmi,
                      bmr: data.bmr
                    })
                    const toast2 = new Toasty({text: "Registration Successfully!"})
                    toast2.show()
                    setTimeout(() => {
                      this.router.navigate(['/login'])
                    }, 400);
                  })
                })
                .catch(() => {
                  const toast = new Toasty({text: "Registration Error!"})
                  toast.show()
                })
            }
          })
      }
    } else {
      const toast = new Toasty({text: "Lengkapi form yang tersedia!"})
      toast.show()
    }
  }
}
