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

  invalidEmail: boolean = false;
  incorrectPass: boolean = false;
  incorrectUser: boolean = false;
  emptyEmail: boolean = false;
  emptyPass: boolean = false;

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
      this.utils.presentToast('El campo correo electrónico es obligatorio');
      this.emptyEmail=true;
      this.incorrectUser=false;
      this.invalidEmail=false;
      return;
    }

    if (this.newLogin.password == '') {
      this.utils.presentToast('El campo contraseña es obligatorio');
      this.emptyPass=true;
      this.incorrectPass=false;
      return;
    }

    this.authSrv.login(this.newLogin).subscribe((res:any) => {

      if (res.status == true) {
        this.authSrv.saveData(res.data);
        localStorage.setItem('typeUser', res.data.type_user);
        this.utils.setLogin(true);

        if (res.data.type_user === "seller") {
          this.router.navigate(['seller']);
        }
        if (res.data.type_user === "mechanic") {
          this.router.navigate(['mechanic']);
        }

        if (res.data.type_user === "admin" || res.data.type_user === "admin_concesionary") {
          this.router.navigate(['home-admin']);
        }

      }else{
        this.utils.presentToast(res.message);
        if (res.message === 'Contraseña incorrecta') this.incorrectPass=true;
        if (res.message === 'Ususario no registrado') this.incorrectUser=true;
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

  public validEmail(event:any){
    if (event.detail.value !== '') {
      this.incorrectUser=false;
      this.emptyEmail=false;
      if (!this.utils.validateEmail(event.detail.value)) {
        this.invalidEmail=true;
      }else{
        this.invalidEmail=false;
      }
    }
  }

  public validPass(event:any){
    if(event.detail.value !== ''){
      if (this.incorrectPass) this.incorrectPass = false; 
      if (this.emptyPass) this.emptyPass = false;
    }
  }

  public enterKey(event:any){
    console.log(event)
    if (event.keyCode === '13') this.login(); 
  }
}
