import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeMechanicPageRoutingModule } from './home-mechanic-routing.module';

import { HomeMechanicPage } from './home-mechanic.page';
import { ComponentModule } from '../component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeMechanicPageRoutingModule,
    ComponentModule
  ],
  declarations: [HomeMechanicPage]
})
export class HomeMechanicPageModule {}
