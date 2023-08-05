import { Component, OnInit } from '@angular/core';
import { models } from 'src/assets/json/models';

@Component({
  selector: 'app-models-modal-filter',
  templateUrl: './models-modal-filter.component.html',
  styleUrls: ['./models-modal-filter.component.scss'],
})
export class ModelsModalFilterComponent  implements OnInit {

  arrayModels: any[]=[];

  constructor() {
    this.arrayModels = models;
  }

  ngOnInit() {}

}
