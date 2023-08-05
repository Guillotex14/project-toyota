import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MechanicalFileDetailMechanicPageRoutingModule } from './mechanical-file-detail-mechanic-routing.module';

import { MechanicalFileDetailMechanicPage } from './mechanical-file-detail-mechanic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MechanicalFileDetailMechanicPageRoutingModule
  ],
  declarations: [MechanicalFileDetailMechanicPage]
})
export class MechanicalFileDetailMechanicPageModule {}
