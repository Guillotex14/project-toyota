import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SellsHistoryPageRoutingModule } from './sells-history-routing.module';

import { SellsHistoryPage } from './sells-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SellsHistoryPageRoutingModule
  ],
  declarations: [SellsHistoryPage]
})
export class SellsHistoryPageModule {}
