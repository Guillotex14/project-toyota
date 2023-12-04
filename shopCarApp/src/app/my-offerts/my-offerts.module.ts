import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyOffertsPageRoutingModule } from './my-offerts-routing.module';

import { MyOffertsPage } from './my-offerts.page';
import { ComponentModule } from '../component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyOffertsPageRoutingModule,
    ComponentModule
  ],
  declarations: [MyOffertsPage]
})
export class MyOffertsPageModule {}
