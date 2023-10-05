import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, AlertController } from '@ionic/angular';
import { AdminService } from '../services/admin/admin.service';
import { SellersList } from 'src/models/admin';
import {states} from 'src/assets/json/states';
import { concesionaries } from 'src/assets/json/concesionaries';
import { UtilsService } from '../services/utils/utils.service';

@Component({
  selector: 'app-edit-user-admin',
  templateUrl: './edit-user-admin.page.html',
  styleUrls: ['./edit-user-admin.page.scss'],
})
export class EditUserAdminPage implements OnInit {

  id: { id: string} = { id: ""};
  password: string = "";
  password_confirm: string = "";
  typeInput: string = "password";
  typeInputConfirm: string = "password";
  seller: SellersList = new SellersList();
  arrayCities: any[] = states;
  arrayConcesionaries: any[] = concesionaries;
  auxConces: any[] = concesionaries;

  constructor(private router: Router, private menu: MenuController, private actRoute: ActivatedRoute, private adminSrv: AdminService, private utils: UtilsService, private alertCtrl:AlertController) {

    this.id.id = this.actRoute.snapshot.params['id'];
    this.sellerById();
    this.seller._id = this.id.id;
    this.seller.type_user = "Vendedor";
    this.seller.id_user = "";
    this.seller.email = "";
    this.seller.username = "";
    this.seller.fullName = "";
    this.seller.city = "";
    this.seller.phone = "";
    this.seller.concesionary = "";

  }

  ngOnInit() {
  }

  public goTo(){
    this.router.navigate(['list-user-admin']);
  }

  public openMenu() {
    this.utils.setLogin(true);
    this.menu.open();
  }

  public sellerById(){
    this.utils.presentLoading("Cargando...");
    this.adminSrv.getSellerById(this.id).subscribe((res: any) => {
      if (res.status) {
        this.seller = res.data;
        this.utils.dismissLoading();
      }
    });
  }

  public filterConces(event:any){
    if (this.seller.city == '' || this.seller.city == undefined || this.seller.city == null) {
      this.auxConces = this.arrayConcesionaries;
    }else{

      this.auxConces = [];

      let zon;

      for (let i = 0; i < this.arrayConcesionaries.length; i++) {
        zon = this.arrayConcesionaries[i].estado.toLowerCase();
        if (zon.includes(this.seller.city.toLowerCase())) {
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
      ...this.seller,
      password: this.password
    }

    this.utils.presentLoading("Actualizando usuario...")
    this.adminSrv.updateSeller(data).subscribe((resp:any)=>{
      if (resp.status) {
        this.utils.dismissLoading();
        this.utils.presentToast("Usuario actualizado exitosamente");
        this.router.navigate(['list-user-admin']);
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
    this.utils.presentLoading("Eliminando...");
    let data = { id: this.seller._id };
    this.adminSrv.deleteSeller(data).subscribe((res: any) => {
      if (res.status) {
        // this.sellerById();
        this.utils.dismissLoading();
        this.router.navigate(['list-user-admin']);
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
}
