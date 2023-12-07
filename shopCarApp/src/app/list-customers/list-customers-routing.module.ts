import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListCustomersPage } from './list-customers.page';

const routes: Routes = [
  {
    path: '',
    component: ListCustomersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListCustomersPageRoutingModule {}
