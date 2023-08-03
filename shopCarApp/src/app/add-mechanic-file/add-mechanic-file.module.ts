import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMechanicFilePageRoutingModule } from './add-mechanic-file-routing.module';

import { AddMechanicFilePage } from './add-mechanic-file.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMechanicFilePageRoutingModule
  ],
  declarations: [AddMechanicFilePage]
})
export class AddMechanicFilePageModule {}
