import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { SellerService } from '../services/seller/seller.service';
import { UtilsService } from '../services/utils/utils.service';
import { VehicleList } from 'src/models/sellet';
import { models } from 'src/assets/json/models';
import { states } from 'src/assets/json/states';

@Component({
  selector: 'app-buy-car',
  templateUrl: './buy-car.page.html',
  styleUrls: ['./buy-car.page.scss'],
})
export class BuyCarPage implements OnInit {

  arrayVehicles: VehicleList[] = [];
  arrayNotifies: any[] = [];
  arrayModels: any[]=[];
  arrayUbication: any[]=[];
  arrayBrands: any[]=[];
  minYear: string = "";
  maxYear: string = "";
  minPrice: string = "";
  maxPrice: string = "";
  minKms: string = "";
  maxKms: string = "";
  brand: string = "";
  model: string = "";
  ubication: string = "";
  type_vehicle: string = "";

  minYearAux: string = "";
  maxYearAux: string = "";
  minPriceAux: string = "";
  maxPriceAux: string = "";
  minKmsAux: string = "";
  maxKmsAux: string = "";

  constructor(private menu: MenuController, private router: Router, private sellerSrv: SellerService, private utils: UtilsService, private modalCtrl: ModalController) {
    this.arrayModels = models;
    this.arrayUbication = states;
    
    this.getBrands();
    this.getVehicles();

  }


  ngOnInit() {
  }

  public getBrands(){
    this.sellerSrv.allBrands().subscribe((res: any) => {
      this.arrayBrands = res.data;

    }, (err: any) => {
      console.log(err);
    });
  }

  public openMenu() {
    this.menu.open();
  }

  public goBack() {
    this.router.navigate(['/seller']);
  }

  public goDetail(id: string){
    this.router.navigate(['/car-detail/'+id+'/buy-car']);
  }

  public dismissModal(){
    this.modalCtrl.dismiss();
  }

  public applyFilter(){
    this.getVehicles()
    this.modalCtrl.dismiss();
  }

  public getVehicles(){
    let data = {
      brand: this.brand,
      model: this.model,
      ubication: this.ubication,
      type_vehicle: this.type_vehicle,
      minYear: parseInt(this.minYear) > 0 ? parseInt(this.minYear) : 0,
      maxYear: parseInt(this.maxYear) > 0 ? parseInt(this.maxYear) : 0,
      minPrice: parseInt(this.minPrice) > 0 ? parseInt(this.minPrice) : 0,
      maxPrice: parseInt(this.maxPrice) > 0 ? parseInt(this.maxPrice) : 0,
      minKm: parseInt(this.minKms) > 0 ? parseInt(this.minKms) : 0,
      maxKm: parseInt(this.maxKms) > 0 ? parseInt(this.maxKms) : 0
    }

    this.utils.presentLoading("Cargando vehiculos");
    this.sellerSrv.getListByFilter(data).subscribe((data:any)=>{
      if (data.status) {
        this.utils.dismissLoading();
        this.arrayVehicles = data.data;
      }else{
        this.utils.dismissLoading();
        this.utils.presentToast(data.message);
      }
    },
    (error:any)=>{
      this.utils.dismissLoading();
      this.utils.presentToast("Error de servidor");
    })
  }

  public dotMinYear(input:any){
    var num = input.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      input.value = num;
      this.minYearAux = num;
      this.minYear = input.value.replace(/\./g,'');
    }else{ 
      
      input.value = input.value.replace(/[^\d\.]*/g,'');
    }
  }

  public dotMaxYear(input:any){
    var num = input.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      input.value = num;
      this.maxYearAux = num;
      this.maxYear = input.value.replace(/\./g,'');
    }else{ 
      
      input.value = input.value.replace(/[^\d\.]*/g,'');
    }
  }

  public dotMinKm(input:any){
    var num = input.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      input.value = num;
      this.minKmsAux = num;
      this.minKms = input.value.replace(/\./g,'');
    }else{ 
      
      input.value = input.value.replace(/[^\d\.]*/g,'');
    }
  }

  public dotMaxKm(input:any){
    var num = input.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      input.value = num;
      this.maxKmsAux = num;
      this.maxKms = input.value.replace(/\./g,'');
    }else{ 
      
      input.value = input.value.replace(/[^\d\.]*/g,'');
    }
  }

  public dotMinPrice(input:any){
    var num = input.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      input.value = num;
      this.minPriceAux = num;
      this.minPrice = input.value.replace(/\./g,'');
    }else{ 
      
      input.value = input.value.replace(/[^\d\.]*/g,'');
    }
  }

  public dotMaxPrice(input:any){
    var num = input.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      input.value = num;
      this.maxPriceAux = num;
      this.maxPrice = input.value.replace(/\./g,'');
    }else{ 
      
      input.value = input.value.replace(/[^\d\.]*/g,'');
    }
  }

  public deleteArray(i:any){
    this.arrayVehicles.splice(i, 1);
  }
}
