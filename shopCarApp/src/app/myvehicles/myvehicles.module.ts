import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyvehiclesPageRoutingModule } from './myvehicles-routing.module';

import { MyvehiclesPage } from './myvehicles.page';
import { ComponentModule } from '../component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyvehiclesPageRoutingModule,
    ComponentModule
  ],
  declarations: [MyvehiclesPage]
})
export class MyvehiclesPageModule {}
