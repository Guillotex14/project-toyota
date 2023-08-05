import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraphicsAdminPageRoutingModule } from './graphics-admin-routing.module';

import { GraphicsAdminPage } from './graphics-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GraphicsAdminPageRoutingModule
  ],
  declarations: [GraphicsAdminPage]
})
export class GraphicsAdminPageModule {}
