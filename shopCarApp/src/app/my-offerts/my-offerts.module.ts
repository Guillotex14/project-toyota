import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyOffertsPageRoutingModule } from './my-offerts-routing.module';

import { MyOffertsPage } from './my-offerts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyOffertsPageRoutingModule
  ],
  declarations: [MyOffertsPage]
})
export class MyOffertsPageModule {}
