import { Component, OnInit, ViewChild } from '@angular/core';
import {  Router } from '@angular/router';
import { IonInfiniteScroll, IonModal, MenuController, ModalController } from '@ionic/angular';
import { UtilsService } from '../services/utils/utils.service';
import { AdminService } from '../services/admin/admin.service';
import { NotificationById, VehicleList } from 'src/models/sellet';
import { states } from 'src/assets/json/states';
import { AuthService } from '../services/auth/auth.service';
import { MechanicService } from '../services/mechanic/mechanic.service';

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

  pageNotifies: any = {
    pos: 0,
    lim: 20
  }
  arrayNotifies: any[] = [];
  countNotifies: number = 0;
  notificationById: NotificationById = new NotificationById();

  @ViewChild('modalFilterHomeAdmin') modalFilter!: IonModal;
  @ViewChild('modalNotifications') modal!: IonModal;
  @ViewChild('modalDetailNotification') filterModal!: IonModal;
  @ViewChild('infiniteScroll') infiniteScroll!: IonInfiniteScroll;
  me: any;
  
  constructor(private menu: MenuController, private router: Router, private utils: UtilsService, private adminSrv: AdminService, private modalCtrl: ModalController, private authSrv: AuthService, private mechanicSrv: MechanicService) { 
    this.arrayUbication = states;
    this.me = this.authSrv.getMeData();
    // this.getVehicles();
    // this.getBrands();
    // this.getModels();
    
  }
  
  ionViewWillEnter(){
    this.getVehicles();
    this.getBrands();
    this.getModels();
    this.getNotifies();
    this.getCountNotifies();
  }
  ngOnInit() {
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
  
  public getNotifies(){
    
    this.pageNotifies.id_user = this.me.id;

    this.mechanicSrv.getNotifications(this.pageNotifies).subscribe((data:any)=>{
      if (data.status) {
        this.arrayNotifies = data.data.rows;
      }
    });
  
  }

  public updateNotification(){
    let data = {
      id: this.notificationById._id
    }

    this.mechanicSrv.updateNotification(data).subscribe((data:any)=>{
      if (data.status) {
        this.getNotifies();
        this.getCountNotifies();
      }
    })
  }

  public getCountNotifies() {
    let data = {
      id_user: this.me.id ? this.me.id : null
    }

    this.mechanicSrv.getCountNotifications(data).subscribe((data:any)=>{
      if (data.status) {
        this.countNotifies = data.data;
      }else{
        this.countNotifies = 0;
      }
    });
  }

  public openModalNotification(){
    if (this.arrayNotifies.length > 0 ) {
      this.modal.present();
    }
  }


  public openDetailNotification(id: any){
    

    let data = {
      id: id
    }

    this.mechanicSrv.notificationById(data).subscribe((data:any)=>{
      if (data.status) {
        this.notificationById = data.data;
        this.filterModal.present();
        this.updateNotification();
        this.getNotifies();
        this.getCountNotifies();
      }

    })
  }

  public loadData(eve:any){
    this.pageNotifies.pos+=1;
    let moreNotifies = []
    this.mechanicSrv.getNotifications(this.pageNotifies).subscribe((resp:any)=>{
      if (resp.status) {
        if (resp.data.rows.length > 0) {
          moreNotifies = resp.data.rows;
          moreNotifies.map((data:any)=>{
            this.arrayNotifies.push(data)
          })
        }
      }
    })
    this.infiniteScroll.complete();
  }

  public closeModal(){
    this.modal.dismiss();
  }

  public closeModalDetail(){
    this.filterModal.dismiss();

    // if(this.arrayNotifies.length == 0){
    //   this.modal.dismiss();
    // }else{
    //   this.filterModal.dismiss();
    // }
  }

  public goDetail(id: any){

    this.closeModal();
    this.closeModalDetail();

    this.router.navigate(['car-detail-mechanic/'+id+'/home-mechanic']);
  }
}
