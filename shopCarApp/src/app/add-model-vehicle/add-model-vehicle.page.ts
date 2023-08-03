import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AdminService } from '../services/admin/admin.service';
import { UtilsService } from '../services/utils/utils.service';

@Component({
  selector: 'app-add-model-vehicle',
  templateUrl: './add-model-vehicle.page.html',
  styleUrls: ['./add-model-vehicle.page.scss'],
})
export class AddModelVehiclePage implements OnInit {

  model: string = "";
  type_vehicle: string = "";
  brand: string = "";
  arrayBrands: any[] = [];
  constructor(private menu: MenuController, private router:Router, private adminSrv:AdminService, private utils:UtilsService) { 
    this.getBrands();
  }

  ngOnInit() {
  }

  public openMenu() {
    this.menu.open();
  }

  public goBack() {
    this.router.navigate(['home-admin']);
  }

  public getBrands(){
    this.adminSrv.allBrands().subscribe((res: any) => {
        console.log(res)
        this.arrayBrands = res.data;

      }, (err: any) => {
        console.log(err);
      });

  }

  public addModel(){
    this.utils.presentLoading("Agregando modelo...");
    if (this.model != "" && this.type_vehicle != "" && this.brand != "") {

      let data = {
        model: this.model,
        type_vehicle: this.type_vehicle,
        brand: this.brand
      }

      this.adminSrv.addModel(data).subscribe((res:any) => {
        if(res.status){
          this.utils.dismissLoading();
          this.utils.presentToast("Modelo agregado correctamente");
          this.router.navigate(['home-admin']);
          this.model = "";
          this.type_vehicle = "";
          this.brand = "";
        }else{
          this.utils.dismissLoading();
          this.utils.presentToast("Error al agregar el modelo");
        }
      }, err => {
        console.error(err);
        this.utils.dismissLoading();
        this.utils.presentToast("Error al agregar el modelo");
      });

    }else{
      if (this.model == "") {
        this.utils.dismissLoading();
        this.utils.presentToast("Ingrese el modelo");
      }else if (this.type_vehicle == "") {
        this.utils.dismissLoading();
        this.utils.presentToast("Ingrese el tipo de vehículo");
      }else if (this.brand == "") {
        this.utils.dismissLoading();
        this.utils.presentToast("Ingrese la marca");
      }
      
    }

  }


}
