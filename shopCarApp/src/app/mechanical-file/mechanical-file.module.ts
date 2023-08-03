import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MechanicalFilePageRoutingModule } from './mechanical-file-routing.module';

import { MechanicalFilePage } from './mechanical-file.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MechanicalFilePageRoutingModule
  ],
  declarations: [MechanicalFilePage]
})
export class MechanicalFilePageModule {}
