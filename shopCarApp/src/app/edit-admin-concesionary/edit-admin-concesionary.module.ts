import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAdminConcesionaryPageRoutingModule } from './edit-admin-concesionary-routing.module';

import { EditAdminConcesionaryPage } from './edit-admin-concesionary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditAdminConcesionaryPageRoutingModule
  ],
  declarations: [EditAdminConcesionaryPage]
})
export class EditAdminConcesionaryPageModule {}
