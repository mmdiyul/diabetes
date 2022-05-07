import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterExtensions } from '@nativescript/angular';
import { Page } from '@nativescript/core';
import * as Firebase from '@nativescript/firebase/app'
import { Toasty } from '@triniwiz/nativescript-toasty';
import * as appSettings from '@nativescript/core/application-settings'

@Component({
  selector: 'ns-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  form: FormGroup

  constructor(
    private page: Page,
    private fb: FormBuilder,
    private router: RouterExtensions
  ) {
    this.page.actionBarHidden = true;
    this.form = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    })
    if (appSettings.getString('user-id')) {
      this.router.navigate(['/home'])
    }
  }

  ngOnInit(): void {
  }

  onChange(name: any, event: any) {
    this.form.get(name).setValue(event.object.text)
  }

  login(): void {
    if (this.form.valid) {
      const data = this.form.value
      Firebase.firestore().collection('users').where('username', '==', data.username).where('password', '==', data.password).get()
        .then((result) => {
          if (result.docSnapshots.length) {
            const toast = new Toasty({text: "Berhasil login!"})
            toast.show()
            appSettings.setString('user-id', result.docSnapshots[0].id)
            console.log(appSettings.getString('user-id'))
            setTimeout(() => {
              this.router.navigate(['/home'])
            }, 100);
          } else {
            const toast = new Toasty({text: "Username atau password salah!"})
            toast.show()
          }
        })
    } else {
      const toast = new Toasty({text: "Masukkan username dan password!"})
      toast.show()
    }
  }

}
