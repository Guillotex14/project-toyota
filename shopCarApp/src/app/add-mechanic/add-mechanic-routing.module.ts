import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMechanicPage } from './add-mechanic.page';

const routes: Routes = [
  {
    path: '',
    component: AddMechanicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMechanicPageRoutingModule {}
