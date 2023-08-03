import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeSellerPageRoutingModule } from './home-seller-routing.module';

import { HomeSellerPage } from './home-seller.page';
import { YearsModalFilterComponent } from '../components/years-modal-filter/years-modal-filter.component';
import { KmModalFilterComponent } from '../components/km-modal-filter/km-modal-filter.component';
import { ModelsModalFilterComponent } from '../components/models-modal-filter/models-modal-filter.component';
import { PriceModalFilterComponent } from '../components/price-modal-filter/price-modal-filter.component';
import { UbicationModalFilterComponent } from '../components/ubication-modal-filter/ubication-modal-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeSellerPageRoutingModule
  ],
  declarations: [HomeSellerPage, YearsModalFilterComponent, ModelsModalFilterComponent,KmModalFilterComponent, UbicationModalFilterComponent,
    PriceModalFilterComponent]
})
export class HomeSellerPageModule {}
