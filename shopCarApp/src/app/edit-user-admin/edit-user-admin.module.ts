import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditUserAdminPageRoutingModule } from './edit-user-admin-routing.module';

import { EditUserAdminPage } from './edit-user-admin.page';
import { ComponentModule } from '../component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditUserAdminPageRoutingModule,
    ComponentModule
  ],
  declarations: [EditUserAdminPage]
})
export class EditUserAdminPageModule {}
