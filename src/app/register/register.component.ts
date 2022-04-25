import { Component, OnInit } from '@angular/core'
import { Page } from '@nativescript/core';

@Component({
  selector: 'ns-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

  constructor(
    private page: Page
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit(): void {
  }
}
