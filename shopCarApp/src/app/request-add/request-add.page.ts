import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { SellerService } from '../services/seller/seller.service';
import { UtilsService } from '../services/utils/utils.service';

@Component({
  selector: 'app-request-add',
  templateUrl: './request-add.page.html',
  styleUrls: ['./request-add.page.scss'],
})
export class RequestAddPage implements OnInit {
  
  title: string = "";
  brand: string = "";
  model: string = "";
  type_vehicle: string = "";

  arrayBrands: any = [] = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private menuCtrl: MenuController, private sellerSrv: SellerService, private utilsSrv: UtilsService) { 

    this.title = this.activatedRoute.snapshot.params['data'];
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getBrands();
  }

  public openMenu() {
    this.menuCtrl.open();
  }

  public goBack() {
    this.router.navigate(['/seller']);
  }

  public getBrands() {
    this.sellerSrv.allBrands().subscribe((res:any) => {
        if(res.status) {
          this.arrayBrands = res.data;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public sendRequestBrand() {
    if (this.brand === "" && this.brand === undefined) {
      this.utilsSrv.presentToast("El campo marca es obligatorio");
      return;
    }

    let data = {
      brand: this.brand
    };

    this.sellerSrv.requestAdd(data).subscribe((res:any) => {
      if(res.status) {
        this.utilsSrv.dismissLoading();
        this.utilsSrv.presentToast("Solicitud enviada");
        this.goBack();
      }else{
        this.utilsSrv.dismissLoading();
        this.utilsSrv.presentToast("Error al enviar la solicitud");
      }
    },
    (err) => {
      console.log(err);
      this.utilsSrv.dismissLoading();
      this.utilsSrv.presentToast("Error al enviar la solicitud");
    });
    
  }

  public sendRequestModel() {
    if (this.brand === "" && this.brand === undefined) {
      this.utilsSrv.presentToast("El campo marca es obligatorio");
      return;
    }

    if (this.model === "" && this.model === undefined) {
      this.utilsSrv.presentToast("El campo modelo es obligatorio");
      return;
    }

    if (this.type_vehicle === "" && this.type_vehicle === undefined) {
      this.utilsSrv.presentToast("El campo tipo de vehiculo es obligatorio");
      return;
    }

    let data = {
      brand: this.brand,
      model: this.model,
      type_vehicle: this.type_vehicle
    };
    this.utilsSrv.presentLoading("Envviando solicitud...")
    this.sellerSrv.requestAdd(data).subscribe((res:any) => {
        if(res.status) {
          this.utilsSrv.dismissLoading();
          this.utilsSrv.presentToast("Solicitud enviada");
          this.goBack();
        }else{
          this.utilsSrv.dismissLoading();
          this.utilsSrv.presentToast("Error al enviar la solicitud");
        }
      },
      (err) => {
        console.log(err);
        this.utilsSrv.dismissLoading();
        this.utilsSrv.presentToast("Error al enviar la solicitud");
      }
    );
  }

}
