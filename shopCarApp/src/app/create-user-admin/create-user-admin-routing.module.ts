import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateUserAdminPage } from './create-user-admin.page';

const routes: Routes = [
  {
    path: '',
    component: CreateUserAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateUserAdminPageRoutingModule {}
