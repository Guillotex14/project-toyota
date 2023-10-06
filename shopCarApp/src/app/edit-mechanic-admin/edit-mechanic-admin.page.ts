import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';

@Component({
  selector: 'app-edit-mechanic-admin',
  templateUrl: './edit-mechanic-admin.page.html',
  styleUrls: ['./edit-mechanic-admin.page.scss'],
})
export class EditMechanicAdminPage implements OnInit {

  constructor(private utils: UtilsService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getMechanicById();
  }

  public getMechanicById(){

  }


  public deleteMechanic(){

  }

  public showAlertDelete(){

  }


}
