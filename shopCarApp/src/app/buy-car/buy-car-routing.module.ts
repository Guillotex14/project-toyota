import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyCarPage } from './buy-car.page';

const routes: Routes = [
  {
    path: '',
    component: BuyCarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyCarPageRoutingModule {}
