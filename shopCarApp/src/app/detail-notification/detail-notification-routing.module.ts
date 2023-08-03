import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailNotificationPage } from './detail-notification.page';

const routes: Routes = [
  {
    path: '',
    component: DetailNotificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailNotificationPageRoutingModule {}
