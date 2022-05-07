import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Page } from '@nativescript/core';
import { Toasty } from '@triniwiz/nativescript-toasty';

@Component({
  selector: 'ns-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

  form: FormGroup

  constructor(
    private page: Page,
    private fb: FormBuilder
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
  }

  submit() {
    if (this.form.valid) {
      const toast = new Toasty({text: "Registering..."})
      toast.show()
      console.log(this.form.value)
    } else {
      const toast = new Toasty({text: "Lengkapi form yang tersedia!"})
      toast.show()
    }
  }
}
