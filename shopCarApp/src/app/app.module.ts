import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FilterModalComponent } from './components/filter-modal/filter-modal.component';
import { ModalMechanicComponent } from './components/modal-mechanic/modal-mechanic.component';
import { ModalAddMechanicComponent } from './components/modal-add-mechanic/modal-add-mechanic.component';

@NgModule({
  declarations: [AppComponent, FilterModalComponent, ModalMechanicComponent, ModalAddMechanicComponent],
  imports: [BrowserModule, RouterModule, FormsModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
