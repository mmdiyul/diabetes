import { Component, OnInit } from '@angular/core'
import { RouterExtensions } from '@nativescript/angular'
import { firebase } from '@nativescript/firebase'
import * as appSettings from '@nativescript/core/application-settings'

@Component({
  selector: 'ns-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  constructor(
    private router: RouterExtensions
  ) {
    if (appSettings.getString('user-id')) {
      this.router.navigate(['/home'])
    } else {
      this.router.navigate(['/login'])
    }
  }

  ngOnInit(): void {
    firebase.init({persist: false})
      .then(() => {
        console.log('Firebase Initialized!')
      })
      .catch((err) => {
        console.log(`Firebase error: ${err}`)
      })
  }
}
