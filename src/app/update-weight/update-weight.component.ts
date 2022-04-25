import { Component, OnInit } from '@angular/core'
import { Page } from '@nativescript/core';

@Component({
  selector: 'ns-update-weight',
  templateUrl: './update-weight.component.html',
})
export class UpdateWeightComponent implements OnInit {

  constructor(
    private page: Page
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit(): void {
  }
}
