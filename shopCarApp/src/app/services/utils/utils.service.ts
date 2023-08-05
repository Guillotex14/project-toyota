import { Injectable } from '@angular/core';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  isLoged: Subject<boolean>;
  isLogin: Subject<boolean>;

  constructor( private toastCtrl: ToastController, private loadCtrl: LoadingController, private alertController: AlertController, private platform: Platform) {
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

  async presentLoading(message: string) {
    const loading = await this.loadCtrl.create({
      message,
      spinner: 'bubbles'
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

}
