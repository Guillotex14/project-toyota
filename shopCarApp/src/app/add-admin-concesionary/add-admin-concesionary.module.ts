import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAdminConcesionaryPageRoutingModule } from './add-admin-concesionary-routing.module';

import { AddAdminConcesionaryPage } from './add-admin-concesionary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddAdminConcesionaryPageRoutingModule
  ],
  declarations: [AddAdminConcesionaryPage]
})
export class AddAdminConcesionaryPageModule {}
