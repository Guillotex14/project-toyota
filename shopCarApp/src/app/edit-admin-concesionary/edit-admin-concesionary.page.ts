import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { CreateAdminConcesionary } from 'src/models/admin';
import { AdminService } from '../services/admin/admin.service';
import { UtilsService } from '../services/utils/utils.service';

@Component({
  selector: 'app-edit-admin-concesionary',
  templateUrl: './edit-admin-concesionary.page.html',
  styleUrls: ['./edit-admin-concesionary.page.scss'],
})
export class EditAdminConcesionaryPage implements OnInit {

  id: any = "";
  adminDetail: CreateAdminConcesionary = new CreateAdminConcesionary();
  arrayCity: any[] = [];
  arrayConcesionaries: any[] = []
  auxConces: any[] = [];
  typeInput: string = "password";
  typeInputConfirm: string = "password";
  password: string = "";
  password_confirm: string = "";

  constructor(private router: Router, private menu: MenuController, private utils: UtilsService, private adminSrv: AdminService, private actRoute: ActivatedRoute, private alertCtrl: AlertController) { 
    this.id = this.actRoute.snapshot.params['id'];
    this.getAdminById();
    this.adminDetail.id = this.id;
    this.adminDetail.email = "";
    this.adminDetail.username = "";
    this.adminDetail.password = "";
    this.adminDetail.password_confirm = "";
    this.adminDetail.city = "";
    this.adminDetail.id_concesionary = "";
    this.adminDetail.type_user = "admin_concesionary";
  }

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

  public filterConces(event:any){
    if (this.adminDetail.city == '' || this.adminDetail.city == undefined || this.adminDetail.city == null) {
      this.auxConces = this.arrayConcesionaries;
    }else{

      this.auxConces = [];

      let zon;

      for (let i = 0; i < this.arrayConcesionaries.length; i++) {
        zon = this.arrayConcesionaries[i].state.toLowerCase();
        if (zon.includes(this.adminDetail.city.toLowerCase())) {
          this.auxConces.push(this.arrayConcesionaries[i]);
        }
      }

    }

  }

  public getAdminById() {
    this.utils.presentLoading("Cargando datos del administrador");
    this.adminSrv.getAdminById(this.id).subscribe((res: any) => {
      console.log(res)
      if (res.status) {
        this.adminDetail = res.data;
        this.adminDetail.city = res.data.concesionary.state;
        this.utils.dismissLoading();
      }else{
        this.utils.dismissLoading();
        this.utils.presentToast(res.message);
      }
    }, (err: any) => {
      console.log(err);
      this.utils.dismissLoading();
      this.utils.presentToast("Error de servidor");
    });
  }

  public updateAdmin() {
    if (this.password != "") {
      if (this.password_confirm == "") {
        this.utils.presentToast("El campo confirmar contraseña es requerido")
        return
      }

      if (this.password != this.password_confirm) {
        this.utils.presentToast("Las contraseñas no coinciden")
        return
      }
    }
    
    let data = {
      ...this.adminDetail,
      password: this.password
    }

    this.utils.presentLoading("Actualizando administrador...")
    this.adminSrv.updateAdmin(data).subscribe((resp:any)=>{
      if (resp.status) {
        this.utils.dismissLoading();
        this.utils.presentToast("Administrador actualizado exitosamente");
        this.router.navigate(['list-admin-concesionary']);
      }
    }, err =>{
      console.error(err)
      this.utils.dismissLoading();
      this.utils.presentToast("Error al actualizar administrador");
    });
  }

  public async presentAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Eliminar',
      message: '¿Está seguro de eliminar al usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {}
        }, {
          text: 'Aceptar',
          handler: () => {
            this.deleteAdmin();
          }
        }
      ]
    });

    return await alert.present();
  }

  public deleteAdmin() {
    this.utils.presentLoading("Eliminando administrador...");
    this.adminSrv.deleteAdmin(this.id).subscribe((resp:any)=>{
      if (resp.status) {
        this.utils.dismissLoading();
        this.utils.presentToast("Administrador eliminado exitosamente");
        this.router.navigate(['list-admin-concesionary']);
      }
    }, err =>{
      console.error(err)
      this.utils.dismissLoading();
      this.utils.presentToast("Error al eliminar administrador");
    });
  }

}
