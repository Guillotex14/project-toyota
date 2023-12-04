import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListUserAdminPageRoutingModule } from './list-user-admin-routing.module';

import { ListUserAdminPage } from './list-user-admin.page';
import { ComponentModule } from '../component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListUserAdminPageRoutingModule,
    ComponentModule
  ],
  declarations: [ListUserAdminPage]
})
export class ListUserAdminPageModule {}
