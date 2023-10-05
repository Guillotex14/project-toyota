import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonActionSheet, MenuController, Platform } from '@ionic/angular';
import { UtilsService } from './services/utils/utils.service';
import { Router } from '@angular/router';

import * as global from '../models/global';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements  OnInit{

  openASEdit: boolean = false;
  typeConection: boolean = false;
  typeUser: string = "";
  username: string = "";
  idUser: string = "";
  image: any = null;
  aux: number = 0;
  url: string = global.urlImgUser;
  actionSheetButtons: any[] = [];
  actionSheetButtonsEdit: any[] = [];
  
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('fileInput2') fileInput2: any;
  @ViewChild('ActionSheet') actionSheet!: IonActionSheet;
  @ViewChild('ActionSheetEdit') actionSheetEdit!: IonActionSheet;

  constructor(private menu: MenuController, private utils: UtilsService, private router: Router, private platform: Platform, private authSrv: AuthService) {

    let data = localStorage.getItem('me');

    if(data){
      let me = JSON.parse(data);
      this.username = me.fullName;
      this.image = me.img;
      this.idUser = me.id;

      if(me.type_user == "admin"){
        this.router.navigate(['home-admin']);
      }else if(me.type_user == "seller"){
        this.router.navigate(['seller']);
      }else if(me.type_user == "mechanic"){
        this.router.navigate(['mechanic']);
      }

    }


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
<<<<<<< HEAD
=======
      console.log(data)
>>>>>>> a9d8cb4316b5dddb3cf2fb2b6196426e94fb1848
      if (data === true) {

        let me = localStorage.getItem('me')!;
        let meJson = JSON.parse(me);
        
        this.username = meJson.fullName;
        this.image = meJson.img;
        this.idUser = meJson.id;
        this.typeUser = meJson.type_user;
      }else{
        this.username = "";
        this.image = null;
        this.idUser = "";
        this.typeUser = "";
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
        text: 'Camara',
        icon: 'camera',
        handler: () => {
          this.takePhoto();
        }
      },
      {
        text: 'Galeria',
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
        text: 'Camara',
        icon: 'camera',
        handler: () => {
          this.editTakePhoto();
        }
      },
      {
        text: 'Galeria',
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
<<<<<<< HEAD
=======
      console.log(data);
>>>>>>> a9d8cb4316b5dddb3cf2fb2b6196426e94fb1848
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
<<<<<<< HEAD
=======
      console.log(error);
>>>>>>> a9d8cb4316b5dddb3cf2fb2b6196426e94fb1848
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

<<<<<<< HEAD
=======
      console.log(data);
>>>>>>> a9d8cb4316b5dddb3cf2fb2b6196426e94fb1848
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
<<<<<<< HEAD
=======
      console.log(error);
>>>>>>> a9d8cb4316b5dddb3cf2fb2b6196426e94fb1848
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
<<<<<<< HEAD
=======
    console.log(this.aux);
>>>>>>> a9d8cb4316b5dddb3cf2fb2b6196426e94fb1848
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
<<<<<<< HEAD
=======
      console.log(imageData)
>>>>>>> a9d8cb4316b5dddb3cf2fb2b6196426e94fb1848
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

}
