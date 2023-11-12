import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditAdminConcesionaryPage } from './edit-admin-concesionary.page';

const routes: Routes = [
  {
    path: '',
    component: EditAdminConcesionaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditAdminConcesionaryPageRoutingModule {}
