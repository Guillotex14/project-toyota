import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMechanicFilePage } from './add-mechanic-file.page';

const routes: Routes = [
  {
    path: '',
    component: AddMechanicFilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMechanicFilePageRoutingModule {}
