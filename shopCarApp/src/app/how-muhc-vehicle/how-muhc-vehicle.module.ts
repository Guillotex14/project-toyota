import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HowMuhcVehiclePageRoutingModule } from './how-muhc-vehicle-routing.module';

import { HowMuhcVehiclePage } from './how-muhc-vehicle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HowMuhcVehiclePageRoutingModule
  ],
  declarations: [HowMuhcVehiclePage]
})
export class HowMuhcVehiclePageModule {}
