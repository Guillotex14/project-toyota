import { Injectable } from '@angular/core';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  isLoged: Subject<boolean>;
  isLogin: Subject<boolean>;
  loading: any;

  constructor( 
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController, private loadCtrl: LoadingController, private alertController: AlertController, private platform: Platform) {
    this.isLoged = new Subject();
    this.isLogin = new Subject<boolean>();
  }

  getOnLoged() {
    return this.isLoged;
  }

  public get onLoged(): Subject<boolean> {
    return this.isLoged;
  }

  setOnLoged(value: boolean) {
    this.isLoged.next(value);
  }

  getLogin(): Observable<boolean> {
    return this.isLogin.asObservable();

  }

  setLogin(value: boolean) {
    this.isLogin.next(value);
  }
  

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando',
      duration: 5000,
    });

    return await this.loading.present();
  }

  dismissLoading2() {
    this.loading.dismiss();
  }

  //////************ plataforma ***********/////

  isApp() {
    let is = false;
    if (
      this.platform.is("mobile") &&
      this.platform.is("cordova") &&
      (this.platform.is("ios") || this.platform.is("android"))
    ) {
      is = true;
    }
    return is;
  }

  /////***************** servicio de alertas  ****************/

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'dark'
    });
    toast.present();

  }

  async presentLoading(message: string,duration:number=1000) {
    const loading = await this.loadCtrl.create({
      message,
      spinner: 'bubbles',
      duration: duration,
    });
    return await loading.present();
  }

  async dismissLoading() {
    setTimeout(async () => {
      await this.loadCtrl.dismiss();
    }, 2000);
  }

  async presentAlertConfirm(message: string, header: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: () => {

          }
        }
      ]
    });

    await alert.present();
  }


  async presentAlert(message?: string, header?: string,subHeader?:string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  async presentAlertComment(message?: string, header?: string,subHeader?:string) {
    const alert = await this.alertController.create({
      header: "",
      subHeader: subHeader,
      message: message,
      inputs:[
        {
          type: 'textarea',
          placeholder: 'Comentario',
        },
      ],

      buttons: ['Aceptar'],
    });

    await alert.present();
  }


  
  public validateEmail(email: string): boolean {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


  ////************************* servicio de comparacion ***************************////

  public addComparasion(data: any){

    let comparasion = JSON.parse(localStorage.getItem('comparasion')!);

    if (comparasion != null && comparasion.length == 4) {
      this.presentAlert('Solo se pueden añadir 4 vehículos a la comparación', 'Comparación', '');
      return;
    }

    if (comparasion == null) {
      localStorage.setItem('comparasion', JSON.stringify([data]));
    } else {
      
      let index = comparasion.find((item: any) => item._id == data._id);
      
      if (!index) {
        comparasion.push(data);
        localStorage.setItem('comparasion', JSON.stringify(comparasion));
        // this.presentToast('Vehiculo agregado a la comparacion');
        this.presentAlert('Vehículo agregado a la comparación', 'Comparación', '')
      } else {
        // this.presentToast('El vehiculo ya esta en la comparacion');
        this.presentAlert('El vehículo se encuentra en comparación', 'Comparación')
      }

    }


  }

  public getComparasion(){
    let comparasion = JSON.parse(localStorage.getItem('comparasion')!);
    return comparasion;
  }

  public deleteComparasion(id: any){
    let comparasion = JSON.parse(localStorage.getItem('comparasion')!);
    let index = comparasion.findIndex((item: any) => item.id == id);
    comparasion.splice(index, 1);
    localStorage.setItem('comparasion', JSON.stringify(comparasion));
  }

}
