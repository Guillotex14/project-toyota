import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarDetailAdminPageRoutingModule } from './car-detail-admin-routing.module';

import { CarDetailAdminPage } from './car-detail-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarDetailAdminPageRoutingModule
  ],
  declarations: [CarDetailAdminPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarDetailAdminPageModule {}
