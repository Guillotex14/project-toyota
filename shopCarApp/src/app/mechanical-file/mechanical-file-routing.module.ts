import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MechanicalFilePage } from './mechanical-file.page';

const routes: Routes = [
  {
    path: '',
    component: MechanicalFilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MechanicalFilePageRoutingModule {}
