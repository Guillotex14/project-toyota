import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MechanicalFileDetailPageRoutingModule } from './mechanical-file-detail-routing.module';

import { MechanicalFileDetailPage } from './mechanical-file-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MechanicalFileDetailPageRoutingModule
  ],
  declarations: [MechanicalFileDetailPage]
})
export class MechanicalFileDetailPageModule {}
