import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListModelAdminPageRoutingModule } from './list-model-admin-routing.module';

import { ListModelAdminPage } from './list-model-admin.page';
import { ComponentModule } from '../component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListModelAdminPageRoutingModule,
    ComponentModule
  ],
  declarations: [ListModelAdminPage]
})
export class ListModelAdminPageModule {}
