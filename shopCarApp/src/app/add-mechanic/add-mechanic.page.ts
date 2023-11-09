import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { CreateMechanic } from 'src/models/sellet';
import { SellerService } from '../services/seller/seller.service';
import { states } from 'src/assets/json/states';
import { UtilsService } from '../services/utils/utils.service';
import { concesionaries } from 'src/assets/json/concesionaries';
import { AuthService } from '../services/auth/auth.service';
import { AdminService } from '../services/admin/admin.service';

@Component({
  selector: 'app-add-mechanic',
  templateUrl: './add-mechanic.page.html',
  styleUrls: ['./add-mechanic.page.scss'],
})
export class AddMechanicPage implements OnInit {

  newMechanic: CreateMechanic = new CreateMechanic();
  arrayCities: any[] = [];
  arrayConcesionaries: any[] = [];
  auxConces: any[] = [];
  typeInput: string = "password";
  typeInputConfirm: string = "password";
  isAdmin: boolean = false;
  user: any = null;

  constructor(private menu: MenuController, private router: Router, private sellerSrv: SellerService, private utils:UtilsService, private authSrv: AuthService, private adminSrv: AdminService) {

    this.newMechanic.email = "";
    this.newMechanic.password = "";
    this.newMechanic.password_confirm = "";
    this.newMechanic.city = "";
    this.newMechanic.concesionary = "";
    this.newMechanic.fullName = "";
    this.newMechanic.username = "";
    this.newMechanic.phone = "";

    this.user = this.authSrv.getMeData();

    if (this.user && this.user.type_user === 'seller') this.newMechanic.city = this.user.city; this.newMechanic.concesionary = this.user.concesionary;
    
    this.allStates();
    this.allConcesionaries();
  }

  ngOnInit() {
  }

  public openMenu() {
    this.utils.setLogin(true);
    this.menu.open();
  }

  public goBack() {
    
    if (this.user.type_user === 'admin_concesionary' || this.user.type_user === 'admin') {
      this.router.navigate(['home-admin']);
    }
    
    if (this.user.type_user === 'seller') {
      this.router.navigate(['seller']);

    }

  }

  public allConcesionaries() {
    this.adminSrv.allConcesionaries().subscribe((res: any) => {
      if (res.status) {
        this.arrayConcesionaries = res.data;
        this.auxConces = res.data;

        if (this.user.type_user == "admin_concesionary" && this.user !== null) {
          this.setConceAndState();
        }

      }else{
        this.utils.presentToast(res.message);
      }
    });
  }

  public allStates() {
    this.adminSrv.allStates().subscribe((res: any) => {
      if (res.status) {
        this.arrayCities = res.data;
      }else{
        this.utils.presentToast(res.message);
      }
    });
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
          this.utils.dismissLoading();
          this.user.type_user === 'seller' ? this.router.navigate(['seller']) : this.router.navigate(['home-admin']) ;
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

  public filterConces(event:any){
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

  public setConceAndState(){
    for (let i = 0; i < this.arrayConcesionaries.length; i++) {
      if (this.arrayConcesionaries[i]._id === this.user.id_concesionary) {
        this.newMechanic.city = this.arrayConcesionaries[i].state;
        this.newMechanic.concesionary = this.arrayConcesionaries[i].name;
      }
    }

  }
}
