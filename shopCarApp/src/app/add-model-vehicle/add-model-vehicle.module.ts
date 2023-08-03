import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddModelVehiclePageRoutingModule } from './add-model-vehicle-routing.module';

import { AddModelVehiclePage } from './add-model-vehicle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddModelVehiclePageRoutingModule
  ],
  declarations: [AddModelVehiclePage]
})
export class AddModelVehiclePageModule {}
