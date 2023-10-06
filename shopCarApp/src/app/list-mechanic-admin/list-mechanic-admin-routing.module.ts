import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListMechanicAdminPage } from './list-mechanic-admin.page';

const routes: Routes = [
  {
    path: '',
    component: ListMechanicAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListMechanicAdminPageRoutingModule {}
