import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreateMechanic } from 'src/models/sellet';
import { states } from 'src/assets/json/states';
import { SellerService } from 'src/app/services/seller/seller.service';
import { UtilsService } from '../../services/utils/utils.service';
import { concesionaries } from 'src/assets/json/concesionaries';

@Component({
  selector: 'app-modal-add-mechanic',
  templateUrl: './modal-add-mechanic.component.html',
  styleUrls: ['./modal-add-mechanic.component.scss'],
})
export class ModalAddMechanicComponent  implements OnInit {

  newMechanic: CreateMechanic = new CreateMechanic();
  // arrayCities: any[] = [];
  arrayCities: any[] = states;
  arrayConcesionaries: any[] = concesionaries;
  auxConces: any[] = concesionaries;
  typeInput: string = "password";
  typeInputConfirm: string = "password";

  constructor(private modalCtrl: ModalController, private sellerSrv: SellerService, private utilsSrv: UtilsService) {

    this.newMechanic.email = "";
    this.newMechanic.password = "";
    this.newMechanic.password_confirm = "";
    this.newMechanic.city = "";
    this.newMechanic.concesionary = "";
    this.newMechanic.fullName = "";
    this.newMechanic.username = "";

    this.arrayCities = states;

    let data = JSON.parse(localStorage.getItem("me")!);

    if (data != null) {
      this.newMechanic.city = data.city;
      this.newMechanic.concesionary = data.concesionary;
    }

  }

  ngOnInit() {}

  public dismissModal(){
    this.modalCtrl.dismiss();
  }
  
  public selectMechanic(){
    this.modalCtrl.dismiss();
  }

  public addMechanic(){

    if (this.newMechanic.email != "" && this.newMechanic.password != "" && this.newMechanic.password_confirm != "" && this.newMechanic.city != "" && this.newMechanic.concesionary != "" && this.newMechanic.fullName != "" && this.newMechanic.username != "" && this.newMechanic.phone != "") {
      this.sellerSrv.addMechanic(this.newMechanic).subscribe((data:any)=>{
        if (data.status) {
          this.utilsSrv.presentToast(data.message);
          this.newMechanic.email = "";
          this.newMechanic.password = "";
          this.newMechanic.password_confirm = "";
          this.newMechanic.city = "";
          this.newMechanic.concesionary = "";
          this.newMechanic.fullName = "";
          this.newMechanic.username = "";
        }else{
          this.utilsSrv.presentToast(data.message);
        }

      }
      ,(error:any)=>{
        console.log(error);
      });
    }else{
      if (this.newMechanic.email == "") {
        this.utilsSrv.presentToast("El email es obligatorio");
        return;
      }

      if (this.newMechanic.password == "") {
        this.utilsSrv.presentToast("La contraseña es obligatoria");
        return
      }

      if (this.newMechanic.password_confirm == "") {
        this.utilsSrv.presentToast("La confirmación de la contraseña es obligatoria");
        return
      }

      if (this.newMechanic.password != this.newMechanic.password_confirm) {
        this.utilsSrv.presentToast("Las contraseñas no coinciden");
        return
      }

      if (this.newMechanic.city == "") {
        this.utilsSrv.presentToast("La estado es obligatoria");
        return
      }

      if (this.newMechanic.concesionary == "") {
        this.utilsSrv.presentToast("La concesionaria es obligatoria");
        return
      }

      if (this.newMechanic.fullName == "") {
        this.utilsSrv.presentToast("El nombre completo es obligatorio");
        return
      }

      if (this.newMechanic.username == "") {
        this.utilsSrv.presentToast("El nombre de usuario es obligatorio");
        return
      }

      if (this.newMechanic.phone == "") {
        this.utilsSrv.presentToast("El numero teléfonico es obligatorio");
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

}
