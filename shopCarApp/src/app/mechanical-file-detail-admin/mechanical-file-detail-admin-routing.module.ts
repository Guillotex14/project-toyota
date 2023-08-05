import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MechanicalFileDetailAdminPage } from './mechanical-file-detail-admin.page';

const routes: Routes = [
  {
    path: '',
    component: MechanicalFileDetailAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MechanicalFileDetailAdminPageRoutingModule {}
