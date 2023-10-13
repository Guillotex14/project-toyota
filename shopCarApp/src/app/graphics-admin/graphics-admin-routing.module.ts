import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraphicsAdminPage } from './graphics-admin.page';


const routes: Routes = [
  {
    path: '',
    component: GraphicsAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GraphicsAdminPageRoutingModule {}
