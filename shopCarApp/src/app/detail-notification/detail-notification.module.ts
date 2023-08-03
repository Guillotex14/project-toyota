import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailNotificationPageRoutingModule } from './detail-notification-routing.module';

import { DetailNotificationPage } from './detail-notification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailNotificationPageRoutingModule
  ],
  declarations: [DetailNotificationPage]
})
export class DetailNotificationPageModule {}
