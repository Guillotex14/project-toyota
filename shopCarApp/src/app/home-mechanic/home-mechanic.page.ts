import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, MenuController } from '@ionic/angular';
import { UtilsService } from '../services/utils/utils.service';
import { MechanicService } from '../services/mechanic/mechanic.service';
import { NotificationById } from 'src/models/sellet';

@Component({
  selector: 'app-home-mechanic',
  templateUrl: './home-mechanic.page.html',
  styleUrls: ['./home-mechanic.page.scss'],
})
export class HomeMechanicPage implements OnInit {

  countInspections: number = 0;
  countNotifies: number = 0;
  id_mechanic: string = "";
  id_user: string = "";
  arrayVehicles: any = [];
  auxVehicles: any = [];

  arrayNotifies: any[] = [];
  notificationById: NotificationById = new NotificationById();
  @ViewChild('modalNotifications') modal!: IonModal;
  @ViewChild('modalDetailNotification') filterModal!: IonModal;

  constructor(private router: Router, private menu: MenuController, private utils: UtilsService, private mechanicSrv: MechanicService) { 

    let data = localStorage.getItem('me');

    if(data){
      let me = JSON.parse(data);
      this.id_mechanic = me.id_mechanic;
      this.id_user = me.id;
    }

    this.getCountInspections();
    this.getvehicles();
    this.getNotifies();
    this.getCountNotifies();
  }

  ngOnInit() {
  }

  public goTo(){
    this.router.navigate(['inspections']);
  }

  public openMenu() {
    this.utils.setLogin(true);
    this.menu.open();
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
        this.countInspections = res.data;
      },
      (error: any) => {
        console.log(error);
      }
    )

  }

  public getvehicles(){

    let data = {
      id_mechanic: this.id_mechanic
    }

    this.utils.presentLoading("Cargando...");

    this.mechanicSrv.getVehicles(data).subscribe(
      (res: any) => {
        console.log(res);
        this.arrayVehicles = res.data;
        this.auxVehicles = res.data;
        this.utils.dismissLoading();
      }
    )
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

}
