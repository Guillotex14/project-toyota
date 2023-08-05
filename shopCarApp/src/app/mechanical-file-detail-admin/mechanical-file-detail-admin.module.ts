import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MechanicalFileDetailAdminPageRoutingModule } from './mechanical-file-detail-admin-routing.module';

import { MechanicalFileDetailAdminPage } from './mechanical-file-detail-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MechanicalFileDetailAdminPageRoutingModule
  ],
  declarations: [MechanicalFileDetailAdminPage]
})
export class MechanicalFileDetailAdminPageModule {}
