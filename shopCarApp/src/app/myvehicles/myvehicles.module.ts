import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyvehiclesPageRoutingModule } from './myvehicles-routing.module';

import { MyvehiclesPage } from './myvehicles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyvehiclesPageRoutingModule
  ],
  declarations: [MyvehiclesPage]
})
export class MyvehiclesPageModule {}
