import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';

@Component({
  selector: 'app-list-model-admin',
  templateUrl: './list-model-admin.page.html',
  styleUrls: ['./list-model-admin.page.scss'],
})
export class ListModelAdminPage implements OnInit {

  constructor(private utils: UtilsService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getModelsList();
  }

  public getModelsList(){

  }

  public getDetailModel(){

  }

  public deleteModel(){

  }

  public showAlertDelete(){

  }

  public onDelete(){

  }
}
