import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyOffertsPage } from './my-offerts.page';

const routes: Routes = [
  {
    path: '',
    component: MyOffertsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyOffertsPageRoutingModule {}
