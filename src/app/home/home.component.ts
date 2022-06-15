import { Component, OnInit } from '@angular/core'
import { RouterExtensions } from '@nativescript/angular';
import { Page } from '@nativescript/core';
import * as appSettings from '@nativescript/core/application-settings'
import * as Firebase from '@nativescript/firebase/app'
import { Toasty } from '@triniwiz/nativescript-toasty';
import * as moment from 'moment';

@Component({
  selector: 'ns-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  user: any
  maxCal: number
  minCal: number
  totalCal: number = 0
  menuMakanan: any[] = []
  menuPagi: any
  menuSiang: any
  menuMalam: any
  menuSnack: any[] = []
  menuMinuman: any[] = []
  idSnack: any[] = []
  idMinuman: any[] = []

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
          this.minCal = parseInt((this.user.bmr * 1.2).toFixed(0))
          this.maxCal = parseInt((this.user.bmr * 1.9).toFixed(0))
        })
        .then(() => {
          Firebase.firestore().collection('menu-makanan').get()
          .then((resp) => {
            resp.forEach(item => {
              const data: any = item.data()
              data.id = item.id
              this.menuMakanan.push(data)
            })
          })
          .then(() => {
            Firebase.firestore().collection('history-makanan').where('userId', '==', appSettings.getString('user-id')).where('timestamp', '==', moment().format('yyyy-MM-DD')).get()
              .then((resp) => {
                if (!resp.docSnapshots.length) {
                  this.afterGetMenuInit()
                } else {
                  const data = resp.docSnapshots[0].data()
                  this.menuPagi = data.makanPagi
                  this.menuSiang = data.makanSiang
                  this.menuMalam = data.makanMalam
                  this.menuSnack = data.snack
                  this.menuMinuman = data.minuman
                }
              })
          })
        })
    }
  }

  afterGetMenuInit(): void {
    const menuPagi = this.menuMakanan.filter(item => item.keterangan == 'Pagi').filter(item => item.kalori < (this.minCal - this.totalCal))
    this.menuPagi = menuPagi[Math.floor(Math.random() * menuPagi.length)]
    this.totalCal = this.totalCal + this.menuPagi.kalori
    const menuSiang = this.menuMakanan.filter(item => item.keterangan == 'Siang').filter(item => item.kalori < (this.minCal - this.totalCal))
    this.menuSiang = menuSiang[Math.floor(Math.random() * menuSiang.length)]
    this.totalCal = this.totalCal + this.menuSiang.kalori
    const menuMalam = this.menuMakanan.filter(item => item.keterangan == 'Malam').filter(item => item.kalori < (this.minCal - this.totalCal))
    this.menuMalam = menuMalam[Math.floor(Math.random() * menuMalam.length)]
    this.totalCal = this.totalCal + this.menuMalam.kalori
    while (this.totalCal < this.minCal) {
      const menuSnack = this.menuMakanan.filter(item => item.kategori == 'Snack').filter(item => item.kalori < (this.minCal - this.totalCal))
      const snack = this.getSnack(menuSnack)
      if (snack) {
        this.totalCal = this.totalCal + snack.kalori
        this.menuSnack.push(snack)
      }
      const menuMinuman = this.menuMakanan.filter(item => item.kategori == 'Minuman').filter(item => item.kalori < (this.minCal - this.totalCal))
      const minuman = this.getMinuman(menuMinuman)
      if (minuman) {
        this.totalCal = this.totalCal + minuman.kalori
        this.menuMinuman.push(minuman)
      }
      if (!snack && !minuman) {
        this.postDataMakanan()
        break;
      }
    }
  }

  postDataMakanan(): void {
    Firebase.firestore().collection('history-makanan').add({
      timestamp: moment().format('yyyy-MM-DD'),
      userId: appSettings.getString('user-id'),
      makanPagi: this.menuPagi,
      makanSiang: this.menuSiang,
      makanMalam: this.menuMalam,
      snack: this.menuSnack,
      minuman: this.menuMinuman
    })
  }

  getSnack(data: any[]): any {
    const filter = data.filter(item => !this.idSnack.includes(item.id))
    if (filter.length) {
      const selected = filter[Math.floor(Math.random() * filter.length)]
      this.idSnack.push(selected.id)
      return selected
    } else {
      return null
    }
  }

  getMinuman(data: any[]): any {
    const filter = data.filter(item => !this.idMinuman.includes(item.id))
    if (filter.length) {
      const selected = filter[Math.floor(Math.random() * filter.length)]
      this.idMinuman.push(selected.id)
      return selected
    } else {
      return null
    }
  }

  updateRecomendation(): void {
    Firebase.firestore().collection('history-makanan').where('userId', '==', appSettings.getString('user-id')).where('timestamp', '==', moment().format('yyyy-MM-DD')).get()
      .then((resp) => {
        resp.docSnapshots.forEach(item => {
          item.ref.delete().then(() => {
            this.totalCal = 0
            this.menuPagi = null
            this.menuSiang = null
            this.menuMalam = null
            this.menuSnack = []
            this.menuMinuman = []
            this.idSnack = []
            this.idMinuman = []
          }).then(() => {
            this.afterGetMenuInit()
            const toast = new Toasty({text: "Rekomendasi makanan telah diperbarui"})
            toast.show()
          })
        })
      })
  }
}
