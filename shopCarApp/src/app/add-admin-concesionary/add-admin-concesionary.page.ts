import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AdminService } from '../services/admin/admin.service';
import { UtilsService } from '../services/utils/utils.service';
import { CreateAdminConcesionary } from '../../models/admin';

@Component({
  selector: 'app-add-admin-concesionary',
  templateUrl: './add-admin-concesionary.page.html',
  styleUrls: ['./add-admin-concesionary.page.scss'],
})
export class AddAdminConcesionaryPage implements OnInit {

  newAdmin: CreateAdminConcesionary = new CreateAdminConcesionary();
  arrayCity: any[] = [];
  arrayConcesionaries: any[] = []
  auxConces: any[] = [];
  typeInput: string = "password";
  typeInputConfirm: string = "password";

  constructor(private router: Router, private menu: MenuController, private utils: UtilsService, private adminSrv: AdminService) { }

  ngOnInit() {
    this.allConcesionaries();
    this.allStates();
  }

  public openMenu() {
    this.utils.setLogin(true);
    this.menu.open();
  }

  public goTo() {
    this.utils.setLogin(true);
    this.router.navigate(['home-admin']);
  }

  public allConcesionaries() {
    this.adminSrv.allConcesionaries().subscribe((res: any) => {
      
      if (res.status) {
        this.arrayConcesionaries = res.data;
        this.auxConces = this.arrayConcesionaries;
      }else{
        this.utils.presentToast(res.message);
      }
      
    }, (err: any) => {
      console.log(err);
    });
  }

  public allStates() {
    this.adminSrv.allStates().subscribe((res: any) => {
        if (res.status) {
          this.arrayCity = res.data;
        }else{
          this.utils.presentToast(res.message);
        }
    }, (err: any) => {
      console.log(err);
    });
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

  filterConces(event:any){
    if (this.newAdmin.city == '' || this.newAdmin.city == undefined || this.newAdmin.city == null) {
      this.auxConces = this.arrayConcesionaries;
    }else{

      this.auxConces = [];

      let zon;

      for (let i = 0; i < this.arrayConcesionaries.length; i++) {
        zon = this.arrayConcesionaries[i].state.toLowerCase();
        if (zon.includes(this.newAdmin.city.toLowerCase())) {
          this.auxConces.push(this.arrayConcesionaries[i]);
        }
      }

    }

  }

  public addAdmin() {
    this.utils.presentLoading("Agregando administrador");

    if (this.newAdmin.email == "" || this.newAdmin.email == undefined || this.newAdmin.email == null) {
      this.utils.dismissLoading();
      this.utils.presentToast("El email es requerido");
      return;
    }

    if (this.newAdmin.username == "" || this.newAdmin.username == undefined || this.newAdmin.username == null) {
      this.utils.dismissLoading();
      this.utils.presentToast("El nombre de usuario es requerido");
      return;
    }

    if (this.newAdmin.password == "" || this.newAdmin.password == undefined || this.newAdmin.password == null) {
      this.utils.dismissLoading();
      this.utils.presentToast("La contraseña es requerida");
      return;
    }

    if (this.newAdmin.password_confirm == "" || this.newAdmin.password_confirm == undefined || this.newAdmin.password_confirm == null) {
      this.utils.dismissLoading();
      this.utils.presentToast("La confirmación de la contraseña es requerida");
      return;
    }

    if (this.newAdmin.password != this.newAdmin.password_confirm) {
      this.utils.dismissLoading();
      this.utils.presentToast("Las contraseñas no coinciden");
      return;
    }

    if (this.newAdmin.id_concesionary == "" || this.newAdmin.id_concesionary == undefined || this.newAdmin.id_concesionary == null) {
      this.utils.dismissLoading();
      this.utils.presentToast("El concesionario es requerido");
      return;
    }

    if (this.newAdmin.city == "" || this.newAdmin.city == undefined || this.newAdmin.city == null) {
      this.utils.dismissLoading();
      this.utils.presentToast("La ciudad es requerida");
      return;
    }

    this.adminSrv.addAdmin(this.newAdmin).subscribe((res: any) => {

      if (res.status == true) {
        this.utils.dismissLoading();
        this.utils.presentToast(res.message);
        this.newAdmin.email = "";
        this.newAdmin.username = "";
        this.newAdmin.password = "";
        this.newAdmin.password_confirm = "";
        this.newAdmin.city = "";

        this.router.navigate(['home-admin']);
      }else{
        this.utils.dismissLoading();
        this.utils.presentToast(res.message);
      }
    }
    ,(error:any)=>{
      console.log(error);
      this.utils.dismissLoading();
      this.utils.presentToast("Error de servidor");
    });
  }

}
