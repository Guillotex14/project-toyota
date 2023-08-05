import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMechanicPageRoutingModule } from './add-mechanic-routing.module';

import { AddMechanicPage } from './add-mechanic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMechanicPageRoutingModule
  ],
  declarations: [AddMechanicPage]
})
export class AddMechanicPageModule {}
