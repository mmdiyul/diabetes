import { Component, OnInit } from '@angular/core'
import { Page } from '@nativescript/core';
import * as Firebase from '@nativescript/firebase/app'

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
    Firebase.firestore().collection('users').get()
      .then((querySnapshot: any) => {
        querySnapshot.forEach(item => {
          console.log(item.id)
          console.log(item.data())
        });
      })
      .catch(err => console.log("Get failed, error: " + err));
  }
}
