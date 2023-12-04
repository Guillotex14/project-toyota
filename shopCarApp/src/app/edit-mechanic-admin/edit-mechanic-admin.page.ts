import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';
import { AdminService } from '../services/admin/admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { states } from 'src/assets/json/states';
import { concesionaries } from 'src/assets/json/concesionaries';
import { AlertController, MenuController } from '@ionic/angular';
import { SellersList } from 'src/models/admin';

@Component({
  selector: 'app-edit-mechanic-admin',
  templateUrl: './edit-mechanic-admin.page.html',
  styleUrls: ['./edit-mechanic-admin.page.scss'],
})
export class EditMechanicAdminPage implements OnInit {

  id: { id_user: string} = { id_user: ""};
  password: string = "";
  password_confirm: string = "";
  typeInput: string = "password";
  typeInputConfirm: string = "password";
  mechanic: SellersList = new SellersList();
  arrayCities: any[] = states;
  arrayConcesionaries: any[] = concesionaries;
  auxConces: any[] = concesionaries;
  loading: boolean = true;
  constructor(private utils: UtilsService, private adminSrv: AdminService, private router: Router, private actRoute: ActivatedRoute, private menu: MenuController, private alertCtrl: AlertController) {
    this.id.id_user = this.actRoute.snapshot.params['id'];
    this.getMechanicById();
    this.mechanic._id = this.id.id_user;
    this.mechanic.type_user = "mechanic";
    this.mechanic.id_user = "";
    this.mechanic.email = "";
    this.mechanic.username = "";
    this.mechanic.fullName = "";
    this.mechanic.city = "";
    this.mechanic.phone = "";
    this.mechanic.concesionary = "";
  }

  ngOnInit() {
  }

  public goTo(){
    this.router.navigate(['list-mechanic-admin']);
  }
  
  public openMenu() {
    this.utils.setLogin(true);
    this.menu.open();
  }
  
  public getMechanicById(){
    this.utils.presentLoading("Cargando Técnico");
    this.adminSrv.getMechanicById(this.id).subscribe((resp:any)=>{
      if (resp.status) {
        this.loading = false;
        this.utils.dismissLoading();
        this.utils.presentToast("Técnico encontrado");
        this.mechanic = resp.data.mechanic;
        this.mechanic.email = resp.data.email;
        this.mechanic.username = resp.data.username;
        this.mechanic.id_user = resp.data.id_user;
        this.mechanic.type_user = resp.data.type_user;

        this.mechanicConce(this.mechanic.city!);
      } else {
        this.utils.dismissLoading();
        this.utils.presentToast("Error al cargar técnico");
      }
    },(error:any)=>{
      this.utils.dismissLoading();
      this.utils.presentToast("Server Error");
    })
  }

  public filterConces(event:any){
    if (this.mechanic.city == '' || this.mechanic.city == undefined || this.mechanic.city == null) {
      this.auxConces = this.arrayConcesionaries;
    }else{

      this.auxConces = [];

      let zon;

      for (let i = 0; i < this.arrayConcesionaries.length; i++) {
        zon = this.arrayConcesionaries[i].estado.toLowerCase();
        if (zon.includes(this.mechanic.city.toLowerCase())) {
          this.auxConces.push(this.arrayConcesionaries[i]);
        }
      }

    }

  }

  public updateProfile(){
    
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
      ...this.mechanic,
      password: this.password
    }

    this.utils.presentLoading("Actualizando usuario...")
    this.adminSrv.updateMechanic(data).subscribe((resp:any)=>{
      if (resp.status) {
        this.utils.dismissLoading();
        this.utils.presentToast("Usuario actualizado exitosamente");
        this.router.navigate(['list-mechanic-admin']);
      }
    }, err =>{
      console.error(err)
      this.utils.dismissLoading();
      this.utils.presentToast("Error al actualizar usuario");
    });
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Eliminar',
      message: '¿Está seguro de eliminar este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {}
        }, {
          text: 'Aceptar',
          handler: () => {
            this.deleteSeller();
          }
        }
      ]
    });

    return await alert.present();
  }

  public deleteSeller() {
    this.utils.presentLoading("Eliminando técnico...");
    let data = { id_user: this.mechanic.id_user };
    this.adminSrv.deleteMechanic(data).subscribe((res: any) => {
      if (res.status) {
        this.utils.dismissLoading();
        this.router.navigate(['list-mechanic-admin']);
      }
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

  public mechanicConce(city:any){
    
    this.auxConces = [];
    let zon;

    for (let i = 0; i < this.arrayConcesionaries.length; i++) {
      zon = this.arrayConcesionaries[i].estado.toLowerCase();
      if (zon.includes(city.toLowerCase())) {
        this.auxConces.push(this.arrayConcesionaries[i]);
      }
    }

  }

}
