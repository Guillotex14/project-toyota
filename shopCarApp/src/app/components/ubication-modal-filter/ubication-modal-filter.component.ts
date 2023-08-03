import { Component, OnInit } from '@angular/core';
import {states} from '../../../assets/json/states';

@Component({
  selector: 'app-ubication-modal-filter',
  templateUrl: './ubication-modal-filter.component.html',
  styleUrls: ['./ubication-modal-filter.component.scss'],
})
export class UbicationModalFilterComponent  implements OnInit {

  arrayUbication: any[]=[];

  constructor() {
    this.arrayUbication = states;
  }

  ngOnInit() {}

}
