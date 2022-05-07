import { Component, OnInit } from '@angular/core'
import { RouterExtensions } from '@nativescript/angular';
import { Page } from '@nativescript/core';
import * as appSettings from '@nativescript/core/application-settings'
import * as Firebase from '@nativescript/firebase/app'

@Component({
  selector: 'ns-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  user: any

  constructor(
    private page: Page,
    private router: RouterExtensions,
  ) {
    this.page.actionBarHidden = true;
  }

  ngOnInit(): void {
    if (!appSettings.getString('user-id')) {
      this.router.navigate(['/login'])
    } else {
      Firebase.firestore().collection('users').doc(appSettings.getString('user-id')).get()
        .then((resp) => {
          this.user = resp.data()
        })
    }
  }
}
