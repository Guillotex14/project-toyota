import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarDetailPageRoutingModule } from './car-detail-routing.module';

import { CarDetailPage } from './car-detail.page';
import { ComponentModule } from '../component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarDetailPageRoutingModule,
    ComponentModule
  ],
  declarations: [CarDetailPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarDetailPageModule {}
