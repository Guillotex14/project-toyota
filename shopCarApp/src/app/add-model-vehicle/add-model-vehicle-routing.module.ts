import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddModelVehiclePage } from './add-model-vehicle.page';

const routes: Routes = [
  {
    path: '',
    component: AddModelVehiclePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddModelVehiclePageRoutingModule {}
