import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MechanicalFileDetailMechanicPage } from './mechanical-file-detail-mechanic.page';

const routes: Routes = [
  {
    path: '',
    component: MechanicalFileDetailMechanicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MechanicalFileDetailMechanicPageRoutingModule {}
