import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListCustomersPageRoutingModule } from './list-customers-routing.module';

import { ListCustomersPage } from './list-customers.page';
import { ComponentModule } from '../component/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListCustomersPageRoutingModule,
    ComponentModule
  ],
  declarations: [ListCustomersPage]
})
export class ListCustomersPageModule {}
