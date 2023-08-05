import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { models } from 'src/assets/json/models';
import {states} from '../../../assets/json/states';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent  implements OnInit {

  arrayModels: any[]=[];
  arrayUbication: any[]=[];

  minYears: string = "";
  maxYears: string = "";
  minPrice: string = "";
  maxPrice: string = "";
  minKms: string = "";
  maxKms: string = "";
  breands: string = "";
  models: string = "";
  ubication: string = "";

  constructor(private modalCtrl: ModalController) {
    this.arrayModels = models;
    this.arrayUbication = states;
  }

  ngOnInit() {}

  dismissModal(){
    this.modalCtrl.dismiss(
      {
        minYears: this.minYears,
        maxYears: this.maxYears,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
        minKms: this.minKms,
        maxKms: this.maxKms,
        breands: this.breands,
        models: this.models,
        ubication: this.ubication
      }
    );
  }

  applyFilter(){
    this.modalCtrl.dismiss({
      minYears: this.minYears,
      maxYears: this.maxYears,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      minKms: this.minKms,
      maxKms: this.maxKms,
      breands: this.breands,
      models: this.models,
      ubication: this.ubication
    });
  }

}
