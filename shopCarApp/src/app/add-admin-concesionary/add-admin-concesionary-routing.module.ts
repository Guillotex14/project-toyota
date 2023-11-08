import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAdminConcesionaryPage } from './add-admin-concesionary.page';

const routes: Routes = [
  {
    path: '',
    component: AddAdminConcesionaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAdminConcesionaryPageRoutingModule {}
