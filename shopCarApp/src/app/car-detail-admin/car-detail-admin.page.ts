import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UtilsService } from '../services/utils/utils.service';
import { SellerService } from '../services/seller/seller.service';
import { CarDetailSeller } from 'src/models/sellet';
import { AdminService } from '../services/admin/admin.service';
import * as global from '../../models/global';

@Component({
  selector: 'app-car-detail-admin',
  templateUrl: './car-detail-admin.page.html',
  styleUrls: ['./car-detail-admin.page.scss'],
})
export class CarDetailAdminPage implements OnInit {
  id: string = "";
  urlImg = global.urlImgvehicles;
  carDetail: CarDetailSeller = new CarDetailSeller();
  
  constructor(private router:Router, private menu: MenuController, private utils: UtilsService, private actRoute:ActivatedRoute, private sellerSrv: SellerService, private adminSrv: AdminService) {
    this.id = this.actRoute.snapshot.params['id'];
    this.getVehicleById();
  }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['home-admin']);
  }

  public openMenu(){
    this.utils.setLogin(true);
    this.menu.open();
  }

  public getVehicleById(){
    let data = {
      id: this.id
    }
    this.utils.presentLoading("Cargando...");
    this.adminSrv.getVehicleById(data).subscribe((data:any) => {

      if(data.status){
        console.log(data);
        this.carDetail = data.data;
        this.utils.dismissLoading();

      }else{
        this.utils.presentToast(data.message);
      }
    });
  }

  public openFile(id_vehicle:any){
    this.router.navigate(['mechanical-file-detail-admin/'+id_vehicle]);
  }

  public setDot(numb:any){
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return str.join(".");
  }
}
