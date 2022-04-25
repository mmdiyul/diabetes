import { Component, OnInit } from '@angular/core'
import { Page } from '@nativescript/core';

@Component({
  selector: 'ns-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  constructor(
    private page: Page
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit(): void {
  }
}
