import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InspectionsPageRoutingModule } from './inspections-routing.module';

import { InspectionsPage } from './inspections.page';
import { ComponentModule } from '../component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InspectionsPageRoutingModule,
    ComponentModule
  ],
  declarations: [InspectionsPage]
})
export class InspectionsPageModule {}
