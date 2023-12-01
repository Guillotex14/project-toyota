import { Component, OnInit, ViewChild } from '@angular/core';
import {  Router } from '@angular/router';
import { IonModal, MenuController, ModalController } from '@ionic/angular';
import { UtilsService } from '../services/utils/utils.service';
import { AdminService } from '../services/admin/admin.service';
import { VehicleList } from 'src/models/sellet';
import { states } from 'src/assets/json/states';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage implements OnInit {

  arrayVehicles: VehicleList[] = [];
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

  loading: boolean = true;

  @ViewChild('modalFilterHomeAdmin') modalFilter!: IonModal;

  constructor(private menu: MenuController, private router: Router, private utils: UtilsService, private adminSrv: AdminService, private modalCtrl: ModalController) { 
    this.arrayUbication = states;
    // this.getVehicles();
    // this.getBrands();
    // this.getModels();
    
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getVehicles();
    this.getBrands();
    this.getModels();
  }

  public getBrands(){
    this.adminSrv.allBrands().subscribe((res: any) => {
      this.arrayBrands = res.data;

    }, (err: any) => {
      console.log(err);
    });
  }

  public getModels(){
    this.adminSrv.allModels().subscribe((res: any) => {
      if(res.status){
        this.arrayModels = res.data;
      }else{
        this.utils.presentToast(res.message)
      }

    }, (err: any) => {
      console.log(err);
      this.utils.presentToast("Error de servidor")
    });
    
  }

  public openMenu() {
    this.utils.setLogin(true);
    this.menu.open();
  }

  public detailVehicle(id: any) {
    this.router.navigate(['car-detail-admin/'+id+'/home-admin']);
  }

  public openModal(){
    this.modalFilter.present();
    this.minYear = "";
    this.maxYear = "";
    this.minPrice = "";
    this.maxPrice = "";
    this.minKms = "";
    this.maxKms = "";
    this.brand = "";
    this.model = "";
    this.ubication = "";
    this.type_vehicle = "";
    this.minYearAux = "";
    this.maxYearAux = "";
    this.minPriceAux = "";
    this.maxPriceAux = "";
    this.minKmsAux = "";
    this.maxKmsAux = "";
  }

  public dismissModal(){
    this.modalFilter.dismiss();
  }

  public applyFilter(){
    this.getVehicles()
    this.modalFilter.dismiss();
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

    this.utils.presentLoading("Cargando vehículos");
    this.adminSrv.getVehicles(data).subscribe((data:any)=>{
      if (data.status) {
        this.loading = false;
        this.utils.dismissLoading();
        this.arrayVehicles = data.data;
      }else{
        this.utils.dismissLoading();
        this.utils.presentToast(data.message);
      }
    },
    (err:any)=>{
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
  
}
