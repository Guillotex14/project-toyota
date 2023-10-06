import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditMechanicAdminPage } from './edit-mechanic-admin.page';

const routes: Routes = [
  {
    path: '',
    component: EditMechanicAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditMechanicAdminPageRoutingModule {}
