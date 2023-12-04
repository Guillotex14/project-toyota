import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MechanicalFileDetailPageRoutingModule } from './mechanical-file-detail-routing.module';

import { MechanicalFileDetailPage } from './mechanical-file-detail.page';
import { ComponentModule } from '../component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MechanicalFileDetailPageRoutingModule,
    ComponentModule
  ],
  declarations: [MechanicalFileDetailPage]
})
export class MechanicalFileDetailPageModule {}
