import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonActionSheet, MenuController, Platform } from '@ionic/angular';
import { UtilsService } from './services/utils/utils.service';
import { Router } from '@angular/router';

import * as global from '../models/global';
import { AuthService } from './services/auth/auth.service';
import { NotificationsService } from './services/notifications/notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements  OnInit{

  typeConection: boolean = false;
  openASEdit: boolean = false;
  concesionary: string = "";
  typeUser: string = "";
  username: string = "";
  idUser: string = "";
  image: any = null;
  aux: number = 0;
  me: any = null;
  url: string = global.urlImgUser;
  actionSheetButtons: any[] = [];
  actionSheetButtonsEdit: any[] = [];
  

  menuAdmin = [
    {
      title: "Inicio",
      url: "/home-admin",
      icon: "home",
      active: false,
    },
    {
      title: "Gráficas",
      url: "graphics-admin",
      icon: "stats-chart",
      active: false,
    },
    {
      title: "Listas",
      open: false,
      icon: "list-outline",
      children: [
        {
          title: "Admins Concesionarios",
          url: "list-admin-concesionary",
          icon: "person",
          active: false,
          users: [
            "admin",
          ]
        },
        {
          title: "Vendedores",
          url: "list-user-admin",
          icon: "people",
          active: false,
          users: [
            "admin",
            "admin_concesionary"
          ]
        },
        {
          title: "Técnicos",
          url: "list-mechanic-admin",
          icon: "construct",
          active: false,
          users: [
            "admin",
            "admin_concesionary"
          ]
        },
        {
          title: "Marcas",
          url: "list-brands",
          icon: "pricetag",
          active: false,
          users: [
            "admin",
            "admin_concesionary"
          ]
        },
        {
          title: "Modelos de Vehículos",
          url: "list-models-vehicles",
          icon: "car-sport",
          active: false,
          users: [
            "admin",
            "admin_concesionary"
          ]
        },
        {
          title: "Clientes potenciales",
          url: "list-customers",
          icon: "people",
          active: false,
          users: [
            "admin",
            "admin_concesionary"
          ]
        },
      ]
    },
    {
      title: "Crear",
      open: false,
      icon: "add",
      children: [
        {
          title: "Admin Concesionario",
          url: "add-admin-concesionary",
          icon: "person",
          active: false,
          users: [
            "admin",
          ]
        },
        {
          title: "Vendedor",
          url: "create-user-admin",
          icon: "people",
          active: false,
          users: [
            "admin",
            "admin_concesionary"
          ]
        },
        {
          title: "Técnico",
          url: "add-mechanic",
          icon: "construct",
          active: false,
          users: [
            "admin",
            "admin_concesionary"
          ]
        },
        {
          title: "Marca",
          url: "add-brand",
          icon: "pricetag",
          active: false,
          users: [
            "admin",
            "admin_concesionary"
          ]
        },
        {
          title: "Modelo de vehículo",
          url: "add-model-vehicle",
          icon: "car-sport",
          active: false,
          users: [
            "admin",
            "admin_concesionary"
          ]
        },
        {
          title: "Cliente potencial",
          url: "customers",
          icon: "people",
          active: false,
          users: [
            "admin_concesionary"
          ]
        }
      ]
    }
  ]

  @ViewChild('fileInput') fileInput: any;
  @ViewChild('fileInput2') fileInput2: any;
  @ViewChild('ActionSheet') actionSheet!: IonActionSheet;
  @ViewChild('ActionSheetEdit') actionSheetEdit!: IonActionSheet;
  
  constructor(private menu: MenuController, private utils: UtilsService, private router: Router, private platform: Platform, private authSrv: AuthService, private notiSrv: NotificationsService) {
    this.notiSrv.initNotifies();
    let data = localStorage.getItem('me');

    // if(data){
    //   let me = JSON.parse(data);
    //   this.username = me.fullName;
    //   this.image = me.img;
    //   this.idUser = me.id;

    //   if(me.type_user == "admin"){
    //     this.router.navigate(['home-admin']);
    //   }else if(me.type_user == "seller"){
    //     this.router.navigate(['seller']);
    //   }else if(me.type_user == "mechanic"){
    //     this.router.navigate(['mechanic']);
    //   }

    // }


    if (this.utils.isApp()) {
      this.typeConection = true;
    }

    this.getLogin();
    this.buttonsActionSheet();
    this.buttonsActionSheetEdit();
  }


  ngOnInit(): void {

  }

  public closeMenu() {
    this.menu.close();
  }

  public getLogin() {
    this.utils.getLogin().subscribe((data) => {
      if (data === true) {

        let me = localStorage.getItem('me')!;
        let meJson = JSON.parse(me);
        
        this.username = meJson.fullName;
        this.image = meJson.img;
        this.idUser = meJson.id;
        this.typeUser = meJson.type_user;
        this.concesionary = meJson.concesionary;
      }else{
        this.username = "";
        this.image = null;
        this.idUser = "";
        this.typeUser = "";
        this.concesionary = "";
      }
    });
  }

  public goTo(route: string) {
    this.router.navigate([route]);
    this.menu.close();
  }

  public logout() {
    this.utils.setLogin(false);
    localStorage.removeItem('typeUser');
    localStorage.removeItem('me');
    this.router.navigate(['login']);
    this.menu.close();
  }

  public updateImage(){
    
  }

  public buttonsActionSheet(){
    this.actionSheetButtons = [
      {
        text: 'Cámara',
        icon: 'camera',
        handler: () => {
          this.takePhoto();
        }
      },
      {
        text: 'Galería',
        icon: 'image',
        handler: () => {
          this.takePhotoGalery();
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel'
      }
    ]
  }

  public buttonsActionSheetEdit(){

    this.actionSheetButtonsEdit = [
      {
        text: 'Cámara',
        icon: 'camera',
        handler: () => {
          this.editTakePhoto();
        }
      },
      {
        text: 'Galería',
        icon: 'image',
        handler: () => {
          this.editTakePhotoGalery();
        }
      },
      {
        text: 'Salir',
        icon: 'close',
        role: 'cancel'
      }
    ]
  }

  public saveImageDB(img:any){

    let data = {
      id_user: this.idUser,
      image: img
    }

    let dataMe = localStorage.getItem('me');
    let me = JSON.parse(dataMe!);

    this.authSrv.addImage(data).subscribe((data:any)=>{
      if(data.status){
        this.image = data.data;
        this.utils.dismissLoading();
        this.utils.presentToast(data.message);
        me = {
          ...me,
          img: data.data
        }
        this.authSrv.saveData(me);

      }else{
        this.utils.dismissLoading();
        this.utils.presentToast(data.message);
      }

    }, (error)=>{
      this.utils.dismissLoading();
      this.utils.presentToast("Error al subir la imagen");
    });

  }

  public updateImgDB(img:any){
    let data = {
      id_user: this.idUser,
      image: img,
      public_id: this.image.public_id
    }

    let dataMe = localStorage.getItem('me');
    let me = JSON.parse(dataMe!);
    
    this.authSrv.UpdateImage(data).subscribe((data:any)=>{

      if(data.status){
        this.image = data.data;
        this.utils.dismissLoading();
        this.utils.presentToast(data.message);
        me = {
          ...me,
          img: data.data
        }
        this.authSrv.saveData(me);
      }else{
        this.utils.dismissLoading();
        this.utils.presentToast(data.message);
      }
    }, (error)=>{
      this.utils.dismissLoading();
      this.utils.presentToast("Error al subir la imagen");
    });

  }

  public addImage() {
    this.fileInput.nativeElement.click();
  }

  public getImage(file:FileList){
    this.utils.presentLoading("Cargando imagen...");
    let reader = new FileReader();
    reader.onload = (e:any)=>{
      let info = e.target["result"];
      let split = info.split("base64");
      let split2 = split[0].split("/");
      let type = split2[1];
      this.saveImageDB(info);
    }
    reader.readAsDataURL(file[0]);
  }

  public getImage2(file:FileList){
    this.utils.presentLoading("Cargando imagen...");
    let reader = new FileReader();
    reader.onload = (e:any)=>{
      let info = e.target["result"];
      let split = info.split("base64");
      let split2 = split[0].split("/");
      let type = split2[1];
      this.updateImgDB(info);
    }
    reader.readAsDataURL(file[0]);
  }

  public editImage(){
    this.fileInput2.nativeElement.click();
  }

  public async takePhoto(){
    
    this.utils.presentLoading("Cargando imagen...");
    const camera = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    }).then((imageData)=>{
      this.saveImageDB(imageData.dataUrl);
    })
    this.utils.dismissLoading();
  }

  public async takePhotoGalery(){
    this.utils.presentLoading("Cargando imagen...");
    const camera = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    }).then((imageData)=>{
      this.saveImageDB(imageData.dataUrl);

    },
    (err)=>{
      console.log(err)
    })

    this.utils.dismissLoading();

  }

  public async editTakePhoto(){
    
    const camera = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    }).then((imageData)=>{
      this.updateImgDB(imageData.dataUrl);
    } ,
    (err)=>{
      console.log(err)
    })

    this.utils.dismissLoading();
  }

  public async editTakePhotoGalery(){
    this.utils.presentLoading("Cargando imagen...");
    const camera = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,

    }).then((imageData)=>{
      this.updateImgDB(imageData.dataUrl);
    } ,
    (err)=>{
      console.log(err)
    })
    this.utils.dismissLoading();

  }

  public openActionSheet(){
    this.actionSheet.present();
    this.closeMenu()
  }

  public openActionSheetEdit(){
    this.actionSheetEdit.present();
    this.closeMenu()
  }

  public closeItem(item:any){
    item.open = !item.open;
  }
}
