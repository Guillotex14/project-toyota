import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListUserAdminPage } from './list-user-admin.page';

const routes: Routes = [
  {
    path: '',
    component: ListUserAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListUserAdminPageRoutingModule {}
