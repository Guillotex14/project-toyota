import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarDetailMechanicPage } from './car-detail-mechanic.page';

const routes: Routes = [
  {
    path: '',
    component: CarDetailMechanicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarDetailMechanicPageRoutingModule {}
