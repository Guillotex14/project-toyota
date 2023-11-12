import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListAdminConcesionaryPage } from './list-admin-concesionary.page';

const routes: Routes = [
  {
    path: '',
    component: ListAdminConcesionaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListAdminConcesionaryPageRoutingModule {}
