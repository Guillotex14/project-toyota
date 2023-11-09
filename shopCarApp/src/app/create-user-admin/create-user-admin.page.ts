import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UtilsService } from '../services/utils/utils.service';
import { CreateSeller } from 'src/models/admin';
import  {states}  from '../../assets/json/states';
import { AdminService } from '../services/admin/admin.service';
import { concesionaries } from '../../assets/json/concesionaries';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-create-user-admin',
  templateUrl: './create-user-admin.page.html',
  styleUrls: ['./create-user-admin.page.scss'],
})
export class CreateUserAdminPage implements OnInit {

  newSeller: CreateSeller = new CreateSeller();
  arrayCity: any[] = [];
  arrayConcesionaries: any[] = []
  auxConces: any[] = [];
  typeInput: string = "password";
  typeInputConfirm: string = "password";
  me: any = null


  constructor(private router:Router, private menu: MenuController, private utils: UtilsService, private adminSrv: AdminService, private authSrv: AuthService) {
    
    this.me = this.authSrv.getMeData();

    this.newSeller.fullName = "";
    this.newSeller.email = "";
    this.newSeller.username = "";
    this.newSeller.password = "";
    this.newSeller.password_confirm = "";
    this.newSeller.city = "";
    this.newSeller.phone = "";
    this.newSeller.concesionary = "";
    this.allStates();
    this.allConcesionaries();

  }

  ngOnInit() {
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
        this.auxConces = res.data;

        if (this.me.type_user == "admin_concesionary" && this.me !== null) {
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
        this.arrayCity = res.data;
      }else{
        this.utils.presentToast(res.message);
      }
    });
  }

  public addSeller() {

    if (this.newSeller.fullName == null || this.newSeller.fullName == "") {
      this.utils.presentToast("El nombre es requerido");
      return;
    }

    if (this.newSeller.email == null || this.newSeller.email == "") {
      this.utils.presentToast("El correo electrónico es requerido");
      return;
    }

    if (this.newSeller.username == null || this.newSeller.username == "") {
      this.utils.presentToast("El nombre de usuario es requerido");
      return;      
    }

    if (this.newSeller.password == null || this.newSeller.password == "") {
      this.utils.presentToast("La contraseña es requerido");
      return;
    }

    if (this.newSeller.password_confirm == null || this.newSeller.password_confirm == "") {
      this.utils.presentToast("La confirmacion de contraseña es requerido");
      return;      
    }

    if (this.newSeller.password != this.newSeller.password_confirm) {
      this.utils.presentToast("Las contraseñas no coinciden");
      return;      
    }

    if (this.newSeller.city == null || this.newSeller.city == "") {
      this.utils.presentToast("El estado es requerido");
      return;      
    }

    if (this.newSeller.concesionary == null || this.newSeller.concesionary == "") {
      this.utils.presentToast("La concesionaria es requerido");
      return;      
    }

    if (this.newSeller.phone == null || this.newSeller.phone == "") {
      this.utils.presentToast("el campo del teléfono es requerido");
      return;      
    }

    this.utils.presentLoading("Registrando vendedor");

    this.adminSrv.addSeller(this.newSeller).subscribe((res: any) => {

      if (res.status == true) {
        this.utils.dismissLoading();
        this.utils.presentToast(res.message);
        this.newSeller.fullName = "";
        this.newSeller.email = "";
        this.newSeller.username = "";
        this.newSeller.password = "";
        this.newSeller.password_confirm = "";
        this.newSeller.city = "";
        this.newSeller.phone = "";
        this.newSeller.concesionary = "";
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

  public filterConces(event:any){
    if (this.newSeller.city == '' || this.newSeller.city == undefined || this.newSeller.city == null) {
      this.auxConces = this.arrayConcesionaries;
    }else{

      this.auxConces = [];

      let zon;

      for (let i = 0; i < this.arrayConcesionaries.length; i++) {
        zon = this.arrayConcesionaries[i].estado.toLowerCase();
        if (zon.includes(this.newSeller.city.toLowerCase())) {
          this.auxConces.push(this.arrayConcesionaries[i]);
        }
      }

    }

  }

  public setConceAndState(){
    for (let i = 0; i < this.arrayConcesionaries.length; i++) {
      if (this.arrayConcesionaries[i]._id === this.me.id_concesionary) {
        this.newSeller.city = this.arrayConcesionaries[i].state;
        this.newSeller.concesionary = this.arrayConcesionaries[i].name;
        
      }
    }


  }
}
