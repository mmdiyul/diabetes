import { Component, OnInit } from '@angular/core'
import { Page } from '@nativescript/core';

@Component({
  selector: 'ns-history',
  templateUrl: './history.component.html',
})
export class HistoryComponent implements OnInit {

  constructor(
    private page: Page
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit(): void {
  }
}
