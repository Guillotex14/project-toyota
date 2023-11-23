import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, } from '@ionic/angular';

import { ComparisonPageRoutingModule } from './comparison-routing.module';

import { ComparisonPage } from './comparison.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComparisonPageRoutingModule
  ],
  declarations: [ComparisonPage],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ComparisonPageModule {}
