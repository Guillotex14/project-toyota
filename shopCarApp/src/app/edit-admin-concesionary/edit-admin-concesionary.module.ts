import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAdminConcesionaryPageRoutingModule } from './edit-admin-concesionary-routing.module';

import { EditAdminConcesionaryPage } from './edit-admin-concesionary.page';
import { ComponentModule } from '../component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditAdminConcesionaryPageRoutingModule,
    ComponentModule
  ],
  declarations: [EditAdminConcesionaryPage]
})
export class EditAdminConcesionaryPageModule {}
