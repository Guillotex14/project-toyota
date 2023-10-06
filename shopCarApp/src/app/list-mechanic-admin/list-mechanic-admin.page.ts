import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';

@Component({
  selector: 'app-list-mechanic-admin',
  templateUrl: './list-mechanic-admin.page.html',
  styleUrls: ['./list-mechanic-admin.page.scss'],
})
export class ListMechanicAdminPage implements OnInit {

  constructor(private utils: UtilsService) { }

  ngOnInit() {
  }


  ionViewWillEnter(){
    this.getMechanicsList();
  }

  public getMechanicsList(){

  }

  public getDetailMechanic(){

  }

  public deleteMechanic(){

  }

  public showAlertDelete(){

  }

  public onDelete(){

  }

  
}
