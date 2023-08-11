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
  theRoute: string = "";
  carDetail: CarDetailSeller = new CarDetailSeller();
  
  constructor(private router:Router, private menu: MenuController, private utils: UtilsService, private actRoute:ActivatedRoute, private sellerSrv: SellerService, private adminSrv: AdminService) {
    this.id = this.actRoute.snapshot.params['id'];
    this.theRoute = this.actRoute.snapshot.params['route'];
    this.carDetail.images = [];

  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getVehicleById();
  }

  goBack(){
    if (this.theRoute==="home-admin") {
      this.router.navigate(['home-admin']);
    }else if(this.theRoute==="graphics-admin"){
      this.router.navigate(['graphics-admin']);
    }
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
        this.utils.dismissLoading();
        this.utils.presentToast(data.message);
      }
    },
    (err:any) => {
      this.utils.dismissLoading();
      this.utils.presentToast("Error de servidor");
    });
  }

  public openFile(){
    this.router.navigate(['mechanical-file-detail-admin/'+this.id+'/'+this.theRoute]);
  }

  public setDot(numb:any){

    if (numb==null) {
      return "0";
    }else{
      var str = numb.toString().split(".");
      str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return str.join(".");
    }
      

  }
}
