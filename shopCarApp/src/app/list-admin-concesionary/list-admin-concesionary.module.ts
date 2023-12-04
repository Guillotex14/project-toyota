import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListAdminConcesionaryPageRoutingModule } from './list-admin-concesionary-routing.module';

import { ListAdminConcesionaryPage } from './list-admin-concesionary.page';
import { ComponentModule } from '../component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListAdminConcesionaryPageRoutingModule,
    ComponentModule
  ],
  declarations: [ListAdminConcesionaryPage]
})
export class ListAdminConcesionaryPageModule {}
