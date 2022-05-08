import { Component, OnInit } from '@angular/core'
import { Page } from '@nativescript/core';
import * as Firebase from '@nativescript/firebase/app'
import * as appSettings from '@nativescript/core/application-settings'
import { Toasty } from '@triniwiz/nativescript-toasty';
import { RouterExtensions } from '@nativescript/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ns-update-weight',
  templateUrl: './update-weight.component.html',
})
export class UpdateWeightComponent implements OnInit {

  form: FormGroup
  user: any
  bmiValue: number = 0
  bmrValue: number = 0

  constructor(
    private page: Page,
    private router: RouterExtensions,
    private fb: FormBuilder,
  ) {
    this.page.actionBarHidden = true;
    this.form = this.fb.group({
      usia: [null, Validators.required],
      tinggi: [null, Validators.required],
      berat: [null, Validators.required],
      bmi: [null, Validators.required],
      bmr: [null, Validators.required]
    })
  }

  ngOnInit(): void {
    if (!appSettings.getString('user-id')) {
      this.router.navigate(['/login'])
    } else {
      Firebase.firestore().collection('users').doc(appSettings.getString('user-id')).get()
        .then((resp) => {
          this.user = resp.data()
          this.bmiValue = this.user.bmi
        })
    }
  }

  onChange(name: any, event: any) {
    this.form.get(name).setValue(event.object.text)
    if (name == 'tinggi' || name == 'berat' || name == 'usia') {
      const usia = this.form.get('usia').value
      const tinggi = this.form.get('tinggi').value
      const berat = this.form.get('berat').value
      if (tinggi && berat) {
        this.bmiValue = parseFloat((berat / ((tinggi / 100) * (tinggi/100))).toFixed(2))
        this.form.get('bmi').setValue(this.bmiValue)
        if (usia) {
          if (this.user.jenis_kelamin == 'Laki-laki') {
            this.bmrValue = (13.397 * berat) + (4.799 * tinggi) - (5.677 * usia) + 88.362
          } else {
            this.bmrValue = (9.247 * berat) + (3.098 * tinggi) - (4.330 * usia) + 447.593
          }
          this.bmrValue = parseInt(this.bmrValue.toFixed(0))
          this.form.get('bmr').setValue(this.bmrValue)
        }
      }
    }
  }

  submit() {
    if (this.form.valid) {
      const data = this.form.value
      if (data.tinggi != this.user.tinggi || data.berat != this.user.berat || data.usia != this.user.usia) {
        Firebase.firestore().collection('users').doc(appSettings.getString('user-id')).update(data)
          .then(() => {
            Firebase.firestore().collection('history').add({
              userId: appSettings.getString('user-id'),
              timestamp: new Date(),
              tinggi: data.tinggi,
              berat: parseFloat(data.berat),
              bmi: data.bmi,
              bmr: data.bmr
            }).then(() => {
              const toast = new Toasty({text: "Berhasil mengubah data!"})
              toast.show()
              setTimeout(() => {
                this.router.navigate(['/home'])
              }, 400);
            })
          })
      } else {
        const toast = new Toasty({text: "Tidak ada data yang diubah!"})
        toast.show()
        setTimeout(() => {
          this.router.navigate(['/home'])
        }, 400);
      }
    }
  }
}
