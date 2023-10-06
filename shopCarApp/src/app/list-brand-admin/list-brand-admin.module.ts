import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListBrandAdminPageRoutingModule } from './list-brand-admin-routing.module';

import { ListBrandAdminPage } from './list-brand-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListBrandAdminPageRoutingModule
  ],
  declarations: [ListBrandAdminPage]
})
export class ListBrandAdminPageModule {}
