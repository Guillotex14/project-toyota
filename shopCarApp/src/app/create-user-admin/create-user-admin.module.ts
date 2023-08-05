import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateUserAdminPageRoutingModule } from './create-user-admin-routing.module';

import { CreateUserAdminPage } from './create-user-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateUserAdminPageRoutingModule
  ],
  declarations: [CreateUserAdminPage]
})
export class CreateUserAdminPageModule {}
