import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeSellerPage } from './home-seller.page';

const routes: Routes = [
  {
    path: '',
    component: HomeSellerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeSellerPageRoutingModule {}
