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

  constructor(
    private page: Page,
    private router: RouterExtensions,
    private fb: FormBuilder,
  ) {
    this.page.actionBarHidden = true;
    this.form = this.fb.group({
      tinggi: [null, Validators.required],
      berat: [null, Validators.required],
      bmi: [null, Validators.required]
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
    if (name == 'tinggi' || name == 'berat') {
      const tinggi = this.form.get('tinggi').value
      const berat = this.form.get('berat').value
      if (tinggi && berat) {
        this.bmiValue = parseFloat((berat / ((tinggi / 100) * (tinggi/100))).toFixed(2))
        this.form.get('bmi').setValue(this.bmiValue)
      }
    }
  }

  submit() {
    console.log(this.form.value)
    console.log('aksgjbsakjfn')
  }
}
