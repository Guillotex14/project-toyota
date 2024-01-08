import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

import { LocalNotifications } from '@capacitor/local-notifications';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http:HttpClient, private platform: Platform, private authSrv: AuthService, private router: Router) { 
    this.initNotifies();
  }

  public initNotifies(){

    if (this.platform.is('capacitor')) {
      PushNotifications.requestPermissions().then( result => {
        console.log('PushNotifications.requestPermissions()')
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
          console.log('PushNotifications.requestPermissions() error')
        }
      });
    }else{
      console.log("No es un dispositivo movil");
    }


  }

  public addListener(){
    
    PushNotifications.addListener('registration',
      (token: Token) => {
        console.log('Push registration success, token: ' + token.value);
        // alert('Push registration success, token: ' + token.value);
      }
    );

    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
        // alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
        //aqui las notificaciones locales
        LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title || '',
              body: notification.body || '',
              id: 1,
              schedule: { at: new Date(Date.now() + 1000 * 5) },
              sound: '',
              attachments: [],
              actionTypeId: "",
              extra: null
            }
          ]
        });


        // alert('Push received: ' + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
        let me = this.authSrv.getMeData();

        if (me.type_user === "seller") {
          this.router.navigate(['seller']);
        }
        if (me.type_user === "mechanic") {
          this.router.navigate(['mechanic']);
        }

        if (me.type_user === "admin" || me.type_user === "admin_concesionary") {
          this.router.navigate(['home-admin']);
        }

        // alert('Push action performed: ' + JSON.stringify(notification));
      }
    );

    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('localNotificationActionPerformed: ', notification);

      let me = this.authSrv.getMeData();

      if (me.type_user === "seller") {
        this.router.navigate(['seller']);
      }
      
      if (me.type_user === "mechanic") {
        this.router.navigate(['mechanic']);
      }

      if (me.type_user === "admin" || me.type_user === "admin_concesionary") {
        this.router.navigate(['home-admin']);
      }
      // alert('localNotificationActionPerformed: ' + JSON.stringify(notification));
    });
  }


  public saveToken(token:string){
    const url = 'http://localhost:3000/token';
    const data = {token:token};
    return this.http.post(url,data);
  }

}

