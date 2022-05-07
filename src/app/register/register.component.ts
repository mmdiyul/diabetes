import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Page } from '@nativescript/core';
import { Toasty } from '@triniwiz/nativescript-toasty';
import * as Firebase from '@nativescript/firebase/app'
import { RouterExtensions } from '@nativescript/angular';

@Component({
  selector: 'ns-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

  form: FormGroup
  bmiValue: number = 0

  constructor(
    private page: Page,
    private fb: FormBuilder,
    private router: RouterExtensions
  ) {
    this.page.actionBarHidden = true;
    this.form = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
      confirm_password: [null, Validators.required],
      usia: [null, Validators.required],
      tinggi: [null, Validators.required],
      berat: [null, Validators.required]
    })
  }

  ngOnInit(): void {
  }

  onChange(name: any, event: any) {
    this.form.get(name).setValue(event.object.text)
    if (name == 'tinggi' || name == 'berat') {
      const tinggi = this.form.get('tinggi').value
      const berat = this.form.get('berat').value
      if (tinggi && berat) {
        this.bmiValue = parseFloat((berat / ((tinggi / 100) * (tinggi/100))).toFixed(2))
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
                      bmi: data.bmi
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
