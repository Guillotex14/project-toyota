import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeMechanicPageRoutingModule } from './home-mechanic-routing.module';

import { HomeMechanicPage } from './home-mechanic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeMechanicPageRoutingModule
  ],
  declarations: [HomeMechanicPage]
})
export class HomeMechanicPageModule {}
