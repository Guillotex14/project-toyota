import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { UtilsService } from '../services/utils/utils.service';
import { AuthService } from '../services/auth/auth.service';
import { LoginModel } from 'src/models/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  newLogin: LoginModel = new LoginModel();
  showPass: string = 'password';
  constructor(private router: Router, private utils:UtilsService, private authSrv:AuthService) {
    this.newLogin.email = '';
    this.newLogin.password = '';
  }

  public goTo(){
    localStorage.setItem('typeUser', '1');
    this.utils.setLogin(true);
    this.router.navigate(['seller']);
  }


  public goToAdmin(){
    localStorage.setItem('typeUser', '2');
    this.utils.setLogin(true);
    this.router.navigate(['home-admin']);
  }

  public goToMechanic(){
    localStorage.setItem('typeUser', '3');
    this.utils.setLogin(true);
    this.router.navigate(['mechanic']);
  }

  public login(){

    if (this.newLogin.email == '') {
      this.utils.presentToast('el campo correo electronico es obligatorio');
      return;
    }

    if (this.newLogin.password == '') {
      this.utils.presentToast('el campo contraseña es obligatorio');
      return;
    }

    this.authSrv.login(this.newLogin).subscribe((res:any) => {
      console.log(res);

      if (res.status == true) {
        this.authSrv.saveData(res.data);
        localStorage.setItem('typeUser', res.data.type_user);
        this.utils.setLogin(true);

        if (res.data.type_user == "seller") {
          this.router.navigate(['seller']);
        }
        if (res.data.type_user == "mechanic") {
          this.router.navigate(['mechanic']);
        }

        if (res.data.type_user == "admin") {
          this.router.navigate(['home-admin']);
        }

      }else{
        this.utils.presentToast(res.message);
      }
    });

  }

  public showPassword(){
    if (this.showPass == 'password') {
      this.showPass = 'text';
    }else{
      this.showPass = 'password';
    }
  }

}
