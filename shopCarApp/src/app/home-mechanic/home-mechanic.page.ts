import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, MenuController, ModalController } from '@ionic/angular';
import { UtilsService } from '../services/utils/utils.service';
import { MechanicService } from '../services/mechanic/mechanic.service';
import { NotificationById } from 'src/models/sellet';
import { states } from 'src/assets/json/states';

@Component({
  selector: 'app-home-mechanic',
  templateUrl: './home-mechanic.page.html',
  styleUrls: ['./home-mechanic.page.scss'],
})
export class HomeMechanicPage implements OnInit, AfterViewInit {

  countInspections: number = 0;
  countNotifies: number = 0;
  id_mechanic: string = "";
  id_user: string = "";
  arrayVehicles: any = [];
  auxVehicles: any = [];
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


  arrayNotifies: any[] = [];
  notificationById: NotificationById = new NotificationById();
  @ViewChild('modalNotifications') modal!: IonModal;
  @ViewChild('modalDetailNotification') filterModal!: IonModal;
  
  constructor(private router: Router, private menu: MenuController, private utils: UtilsService, private mechanicSrv: MechanicService, private modalCtrl: ModalController) { 
    this.arrayUbication = states;
    let data = localStorage.getItem('me');

    if(data){
      let me = JSON.parse(data);
      this.id_mechanic = me.id_mechanic;
      this.id_user = me.id;
    }

    this.getCountInspections();
    this.getvehicles();
    this.getNotifies();
    this.getBrands();
    this.getModels();
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.getCountNotifies();
  }

  public goTo(){
    this.router.navigate(['inspections']);
  }

  public openMenu() {
    this.utils.setLogin(true);
    this.menu.open();
  }

  public getBrands(){
    this.mechanicSrv.allBrands().subscribe((res: any) => {
      this.arrayBrands = res.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  public getModels(){
    this.mechanicSrv.allModels().subscribe((res: any) => {
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

  public goDetail(id: any){
    let data = {
      id: id,
      route: "home-mechanic"
    }
    this.router.navigate(['car-detail-mechanic/'+id+'/home-mechanic']);
  }

  public getCountInspections(){
    
    let id_mechanic = {
      id_mechanic: this.id_mechanic
    }

    this.mechanicSrv.getCountInspections(id_mechanic).subscribe(
      (res: any) => {
        if (res.status) {
          this.countInspections = res.data;
        }else{
          this.utils.presentToast(res.message);
        }
      },
      (error: any) => {
        console.log(error);
        this.utils.presentToast("Error de servidor");
      }
    )

  }

  public getvehicles(){

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
      maxKm: parseInt(this.maxKms) > 0 ? parseInt(this.maxKms) : 0,
      id_mechanic: this.id_mechanic
    }

    this.utils.presentLoading("Cargando...");

    this.mechanicSrv.getVehicles(data).subscribe(
      (res: any) => {
        if (res.status) {
          this.arrayVehicles = res.data;
          this.auxVehicles = res.data;
          this.utils.dismissLoading();
        }else{
          this.utils.dismissLoading();
          this.utils.presentToast(res.message);
        }

      },
      (error: any) => {
        console.log(error);
        this.utils.dismissLoading();
      })
  }

  public searchVehicle(event: any){
    
    if (event.detail.value == "") {
      this.arrayVehicles = this.auxVehicles;
    }else{
      let model;
      let city;
      let brand;
      let concesionary;

      for (let i = 0; i < this.auxVehicles.length; i++) {
        
        model = this.auxVehicles[i].model.toLowerCase();
        city = this.auxVehicles[i].city.toLowerCase();
        brand = this.auxVehicles[i].brand.toLowerCase();
        concesionary = this.auxVehicles[i].concesionary.toLowerCase();
        if (model.include(event.detail.value.toLowerCase()) || city.include(event.detail.value.toLowerCase()) || brand.include(event.detail.value.toLowerCase()) || concesionary.include(event.detail.value.toLowerCase())) {
          this.arrayVehicles.push(this.auxVehicles[i]);
        }
      }
    }
  
  }

  public getNotifies(){
    
    let data = {
      id_user: this.id_user
    }

    this.mechanicSrv.getNotifications(data).subscribe((data:any)=>{
      console.log(data)
      if (data.status) {
        this.arrayNotifies = data.data;
        console.log(this.arrayNotifies)
      }
    });
  
  }

  public updateNotification(){
    let data = {
      id: this.notificationById._id
    }

    this.mechanicSrv.updateNotification(data).subscribe((data:any)=>{
      console.log(data)
      if (data.status) {
        this.getNotifies();
        this.getCountNotifies();
      }
    })
  }

  public getCountNotifies(){
    let data = {
      id_user: this.id_user
    }

    this.mechanicSrv.getCountNotifications(data).subscribe((data:any)=>{
      console.log(data)
      if (data.status) {
        this.countNotifies = data.data;
        console.log(this.countNotifies)
      }else{
        this.countNotifies = 0;
      }
    });
  }

  public openModalNotification(){
    this.modal.present();
  }

  public closeModal(){
    this.modal.dismiss();
  }

  public closeModalDetail(){
    if(this.arrayNotifies.length > 0){
      this.filterModal.dismiss();
    }else{
      this.filterModal.dismiss();
      this.modal.present();
    }
  }

  public openDetailNotification(id: any){
    

    let data = {
      id: id
    }

    this.mechanicSrv.notificationById(data).subscribe((data:any)=>{
      console.log(data)
      if (data.status) {
        this.notificationById = data.data;
        this.filterModal.present();
        this.updateNotification();
      }

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

  public dismissModal(){
    this.modalCtrl.dismiss();
  }

  public applyFilter(){
    this.getvehicles();
    this.modalCtrl.dismiss();
  }

}
