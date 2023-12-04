import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarDetailAdminPageRoutingModule } from './car-detail-admin-routing.module';

import { CarDetailAdminPage } from './car-detail-admin.page';
import { ComponentModule } from '../component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarDetailAdminPageRoutingModule,
    ComponentModule
  ],
  declarations: [CarDetailAdminPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarDetailAdminPageModule {}
