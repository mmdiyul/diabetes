import { Component, OnInit } from '@angular/core'
import { firebase } from '@nativescript/firebase'

@Component({
  selector: 'ns-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
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
