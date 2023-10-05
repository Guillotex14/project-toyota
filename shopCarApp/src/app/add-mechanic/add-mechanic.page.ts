import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { CreateMechanic } from 'src/models/sellet';
import { SellerService } from '../services/seller/seller.service';
import { states } from 'src/assets/json/states';
import { UtilsService } from '../services/utils/utils.service';
import { concesionaries } from 'src/assets/json/concesionaries';

@Component({
  selector: 'app-add-mechanic',
  templateUrl: './add-mechanic.page.html',
  styleUrls: ['./add-mechanic.page.scss'],
})
export class AddMechanicPage implements OnInit {

  newMechanic: CreateMechanic = new CreateMechanic();
  arrayCities: any[] = states;
  arrayConcesionaries: any[] = concesionaries;
  auxConces: any[] = concesionaries;
  typeInput: string = "password";
  typeInputConfirm: string = "password";

  constructor(private menu: MenuController, private router: Router, private sellerSrv: SellerService, private utils:UtilsService) {

    this.newMechanic.email = "";
    this.newMechanic.password = "";
    this.newMechanic.password_confirm = "";
    this.newMechanic.city = "";
    this.newMechanic.concesionary = "";
    this.newMechanic.fullName = "";
    this.newMechanic.username = "";
    this.newMechanic.phone = "";

    let data = JSON.parse(localStorage.getItem("me")!);

    if (data != null) {
      this.newMechanic.city = data.city;
      this.newMechanic.concesionary = data.concesionary;
    }

  }

  ngOnInit() {
  }

  public openMenu() {
    this.utils.setLogin(true);
    this.menu.open();
  }

  public goBack() {
    this.router.navigate(['seller']);
  }

  public addMechanic(){
    this.utils.presentLoading("Registrando mecánico");
    if (this.newMechanic.email != "" && this.newMechanic.password != "" && this.newMechanic.password_confirm != "" && this.newMechanic.city != "" && this.newMechanic.concesionary != "" && this.newMechanic.fullName != "" && this.newMechanic.username != "" && this.newMechanic.phone != "") {
      this.sellerSrv.addMechanic(this.newMechanic).subscribe((data:any)=>{
        if (data.status) {
          this.utils.presentToast(data.message);
          this.newMechanic.email = "";
          this.newMechanic.password = "";
          this.newMechanic.password_confirm = "";
          this.newMechanic.city = "";
          this.newMechanic.concesionary = "";
          this.newMechanic.fullName = "";
          this.newMechanic.username = "";
          this.router.navigate(['seller']);
          this.utils.dismissLoading();
        }else{
          this.utils.presentToast(data.message);
          this.utils.dismissLoading();
        }

      }
      ,(error:any)=>{
        console.log(error);
        this.utils.dismissLoading();
        this.utils.presentToast("Error de servidor");
      });
    }else{
      if (this.newMechanic.email == "") {
        this.utils.dismissLoading();
        this.utils.presentToast("El email es obligatorio");
        return;
      }

      if (this.newMechanic.password == "") {
        this.utils.dismissLoading();
        this.utils.presentToast("La contraseña es obligatoria");
        return;
      }

      if (this.newMechanic.password_confirm == "") {
        this.utils.dismissLoading();
        this.utils.presentToast("La confirmación de la contraseña es obligatoria");
        return;
      }

      if (this.newMechanic.password != this.newMechanic.password_confirm) {
        this.utils.dismissLoading();
        this.utils.presentToast("Las contraseñas no coinciden");
        return;
      }

      if (this.newMechanic.city == "") {
        this.utils.dismissLoading();
        this.utils.presentToast("La estado es obligatoria");
        return
      }

      if (this.newMechanic.concesionary == "") {
        this.utils.dismissLoading();
        this.utils.presentToast("La concesionaria es obligatoria");
        return
      }

      if (this.newMechanic.fullName == "") {
        this.utils.dismissLoading();
        this.utils.presentToast("El nombre completo es obligatorio");
        return
      }

      if (this.newMechanic.username == "") {
        this.utils.dismissLoading();
        this.utils.presentToast("El nombre de usuario es obligatorio");
        return
      }

      if (this.newMechanic.phone == "") {
        this.utils.dismissLoading();
        this.utils.presentToast("El numero teléfonico es obligatorio");
        return
      }
    }
  }

  filterConces(event:any){
    if (this.newMechanic.city == '' || this.newMechanic.city == undefined || this.newMechanic.city == null) {
      this.auxConces = this.arrayConcesionaries;
    }else{

      this.auxConces = [];

      let zon;

      for (let i = 0; i < this.arrayConcesionaries.length; i++) {
        zon = this.arrayConcesionaries[i].estado.toLowerCase();
        if (zon.includes(this.newMechanic.city.toLowerCase())) {
          this.auxConces.push(this.arrayConcesionaries[i]);
        }
      }

    }

  }

  public showPassword() {
    if (this.typeInput == "password") {
      this.typeInput = "text";
    } else {
      this.typeInput = "password";
    }
  }

  public showPasswordConfirm() {
    if (this.typeInputConfirm == "password") {
      this.typeInputConfirm = "text";
    } else {
      this.typeInputConfirm = "password";
    }
  }
}
