import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListModelAdminPage } from './list-model-admin.page';

const routes: Routes = [
  {
    path: '',
    component: ListModelAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListModelAdminPageRoutingModule {}
