import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarDetailAdminPage } from './car-detail-admin.page';

const routes: Routes = [
  {
    path: '',
    component: CarDetailAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarDetailAdminPageRoutingModule {}
