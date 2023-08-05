import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellsHistoryPage } from './sells-history.page';

const routes: Routes = [
  {
    path: '',
    component: SellsHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellsHistoryPageRoutingModule {}
