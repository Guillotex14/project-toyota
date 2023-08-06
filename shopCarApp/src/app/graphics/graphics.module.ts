import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraphicsPageRoutingModule } from './graphics-routing.module';

import { GraphicsPage } from './graphics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GraphicsPageRoutingModule
  ],
  declarations: [GraphicsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GraphicsPageModule {}
