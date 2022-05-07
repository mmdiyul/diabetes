import { Component, OnInit } from '@angular/core'
import { Page } from '@nativescript/core';
import { Toasty } from '@triniwiz/nativescript-toasty';

@Component({
  selector: 'ns-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  constructor(
    private page: Page
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit(): void {
    const toast = new Toasty({text: "Hello world!"})
    toast.show()
  }
}
