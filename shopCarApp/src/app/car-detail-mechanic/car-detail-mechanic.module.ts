import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarDetailMechanicPageRoutingModule } from './car-detail-mechanic-routing.module';

import { CarDetailMechanicPage } from './car-detail-mechanic.page';
import { ComponentModule } from '../component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarDetailMechanicPageRoutingModule,
    ComponentModule
  ],
  declarations: [CarDetailMechanicPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarDetailMechanicPageModule {}
