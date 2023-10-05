import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';

@Component({
  selector: 'app-list-brand-admin',
  templateUrl: './list-brand-admin.page.html',
  styleUrls: ['./list-brand-admin.page.scss'],
})
export class ListBrandAdminPage implements OnInit {

  constructor(private utils: UtilsService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getBrandsList();
  }

  public getBrandsList(){

  }

  public getDetailBrand(){

  }

  public deleteBrand(){

  }

  public showAlertDelete(){

  }

  public onDelete(){

  }


}
