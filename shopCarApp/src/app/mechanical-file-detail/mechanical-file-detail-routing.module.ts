import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MechanicalFileDetailPage } from './mechanical-file-detail.page';

const routes: Routes = [
  {
    path: '',
    component: MechanicalFileDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MechanicalFileDetailPageRoutingModule {}
