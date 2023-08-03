import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyvehiclesPage } from './myvehicles.page';

const routes: Routes = [
  {
    path: '',
    component: MyvehiclesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyvehiclesPageRoutingModule {}
