import { Component, OnInit } from '@angular/core'
import { RouterExtensions } from '@nativescript/angular';
import { Page } from '@nativescript/core';
import * as appSettings from '@nativescript/core/application-settings'
import * as Firebase from '@nativescript/firebase/app'
import * as moment from 'moment';

@Component({
  selector: 'ns-history',
  templateUrl: './history.component.html',
})
export class HistoryComponent implements OnInit {

  user: any
  history: any[] = []

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
      Firebase.firestore().collection('history').where('userId', '==', appSettings.getString('user-id')).orderBy('timestamp', 'desc').get()
        .then((resp) => {
          resp.forEach((item) => {
            this.history.push(item.data())
          })
        })
    }
  }

  convertDate(date: any): string {
    moment.locale('id')
    const momentDate = moment(new Date(date)).format('dddd, DD MMMM YYYY HH:mm:ss')
    return momentDate
  }
}
