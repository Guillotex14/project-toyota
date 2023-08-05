import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HowMuhcVehiclePage } from './how-muhc-vehicle.page';

const routes: Routes = [
  {
    path: '',
    component: HowMuhcVehiclePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HowMuhcVehiclePageRoutingModule {}
