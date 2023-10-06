import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListMechanicAdminPageRoutingModule } from './list-mechanic-admin-routing.module';

import { ListMechanicAdminPage } from './list-mechanic-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListMechanicAdminPageRoutingModule
  ],
  declarations: [ListMechanicAdminPage]
})
export class ListMechanicAdminPageModule {}
