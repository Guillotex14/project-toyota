import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraphicsAdminPageRoutingModule } from './graphics-admin-routing.module';
import { GraphicsAdminPage } from './graphics-admin.page';
import { ComponentModule } from '../component/component.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GraphicsAdminPageRoutingModule,
    ComponentModule
  ],
  declarations: [GraphicsAdminPage]
})
export class GraphicsAdminPageModule {}
