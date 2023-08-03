import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyCarPageRoutingModule } from './buy-car-routing.module';

import { BuyCarPage } from './buy-car.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyCarPageRoutingModule
  ],
  declarations: [BuyCarPage]
})
export class BuyCarPageModule {}
