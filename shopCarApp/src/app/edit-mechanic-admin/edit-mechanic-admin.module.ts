import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditMechanicAdminPageRoutingModule } from './edit-mechanic-admin-routing.module';

import { EditMechanicAdminPage } from './edit-mechanic-admin.page';
import { ComponentModule } from '../component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditMechanicAdminPageRoutingModule,
    ComponentModule
  ],
  declarations: [EditMechanicAdminPage]
})
export class EditMechanicAdminPageModule {}
