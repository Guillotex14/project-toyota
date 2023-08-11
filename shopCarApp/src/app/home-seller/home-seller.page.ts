import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';
import { IonModal, MenuController, ModalController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SellerService } from '../services/seller/seller.service';
import { NotificationById, VehicleList } from 'src/models/sellet';
import { models } from '../../assets/json/models';
import {states} from '../../assets/json/states';
@Component({
  selector: 'app-home-seller',
  templateUrl: './home-seller.page.html',
  styleUrls: ['./home-seller.page.scss'],
})
export class HomeSellerPage implements OnInit {

  arrayVehicles: VehicleList[] = [];
  arrayNotifies: any[] = [];
  notificationById: NotificationById = new NotificationById();
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

  countNotifies: number = 0;
  id_seller: string = "";
  id_user: string = "";
  @ViewChild('modalNotifications') modal!: IonModal;
  @ViewChild('modalDetailNotification') filterModal!: IonModal;

  constructor(private router: Router, private utils: UtilsService, private menu: MenuController, private sellerSrv: SellerService, private modalCtrl: ModalController) {
    this.arrayUbication = states;

    this.notificationById._id = "";
    this.notificationById.id_user = "";
    this.notificationById.title = "";
    this.notificationById.message = "";
    this.notificationById.date = "";
    this.notificationById.status = false;

    let data = localStorage.getItem('me');

    if(data){
      let me = JSON.parse(data);
      this.id_seller = me.id_sell;
      this.id_user = me.id;
    }
    
    // this.getBrands();
    // this.getModels()
    // this.getNotifies();
    // this.getCountNotifies();
    // this.getVehicles();

  }

  ionViewWillEnter(){
    this.getBrands();
    this.getModels()
    this.getNotifies();
    this.getCountNotifies();
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

  public getModels(){
    this.sellerSrv.allModels().subscribe((res: any) => {
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

  public getNotifies(){
    
    let data = {
      id_user: this.id_user
    }

    this.sellerSrv.getNotifications(data).subscribe((data:any)=>{
      if (data.status) {
        this.arrayNotifies = data.data;
        console.log(this.arrayNotifies)
      }
    });
  
  }

  public getCountNotifies(){
    let data = {
      id_user: this.id_user
    }

    this.sellerSrv.getCountNotifications(data).subscribe((data:any)=>{
      if (data.status) {
        this.countNotifies = data.data;
        console.log(this.countNotifies)
      }else{
        this.countNotifies = 0;
      }
    });
  }

  public goTo(route: string){
    this.router.navigate([route]);
  }

  public openMenu() {
    this.utils.setLogin(true);
    this.menu.open();
  }

  public addVehicle(){
    this.router.navigate(['add-vehicle']);
  }

  public goDetail(id: string){
    this.router.navigate(['car-detail/'+id+'/home-seller']);
  }

  public openModalNotification(){
    this.modal.present();
  }

  public closeModal(){
    this.modal.dismiss();
  }

  public openDetailNotification(id: any){
    

    let data = {
      id: id
    }

    this.sellerSrv.notificationById(data).subscribe((data:any)=>{
      console.log(data)
      if (data.status) {
        this.notificationById = data.data;
        this.filterModal.present();
        this.updateNotification();
      }

    })
  }

  public closeModalDetail(){
    if(this.arrayNotifies.length > 0){
      this.filterModal.dismiss();
    }else{
      this.filterModal.dismiss();
      this.modal.present();
    }
  }

  public updateNotification(){
    let data = {
      id: this.notificationById._id
    }

    this.sellerSrv.updateNotification(data).subscribe((data:any)=>{
      console.log(data)
      if (data.status) {
        this.getNotifies();
        this.getCountNotifies();
      }
    })
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

    this.utils.presentLoading("Cargando vehículos");
    this.sellerSrv.getListByFilter(data).subscribe((data:any)=>{
      if (data.status) {
        this.arrayVehicles = data.data;
        this.utils.dismissLoading();
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

  public deleteArray(i:any){
    this.arrayVehicles.splice(i, 1);
  }

}
