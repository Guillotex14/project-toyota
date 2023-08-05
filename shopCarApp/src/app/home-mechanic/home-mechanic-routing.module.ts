import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeMechanicPage } from './home-mechanic.page';

const routes: Routes = [
  {
    path: '',
    component: HomeMechanicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeMechanicPageRoutingModule {}
