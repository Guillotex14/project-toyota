import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListBrandAdminPage } from './list-brand-admin.page';

const routes: Routes = [
  {
    path: '',
    component: ListBrandAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListBrandAdminPageRoutingModule {}
