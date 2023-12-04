import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeAdminPageRoutingModule } from './home-admin-routing.module';

import { HomeAdminPage } from './home-admin.page';
import { ComponentModule } from '../component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeAdminPageRoutingModule,
    ComponentModule
  ],
  declarations: [HomeAdminPage]
})
export class HomeAdminPageModule {}
