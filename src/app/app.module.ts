import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptModule } from '@nativescript/angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ItemsComponent } from './item/items.component'
import { ItemDetailComponent } from './item/item-detail.component'
import { LoginComponent } from './login/login.component'
import { RegisterComponent } from './register/register.component'
import { HomeComponent } from './home/home.component'
import { HistoryComponent } from './history/history.component'
import { AccountComponent } from './account/account.component'
import { UpdateWeightComponent } from './update-weight/update-weight.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  declarations: [AppComponent, ItemsComponent, ItemDetailComponent, LoginComponent, RegisterComponent, HomeComponent, HistoryComponent, AccountComponent, UpdateWeightComponent],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
