import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreateMechanic } from 'src/models/sellet';
import { states } from 'src/assets/json/states';
import { SellerService } from 'src/app/services/seller/seller.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
@Component({
  selector: 'app-modal-add-mechanic',
  templateUrl: './modal-add-mechanic.component.html',
  styleUrls: ['./modal-add-mechanic.component.scss'],
})
export class ModalAddMechanicComponent  implements OnInit {

  newMechanic: CreateMechanic = new CreateMechanic();
  arrayCities: any[] = [];

  constructor(private modalCtrl: ModalController, private sellerSrv: SellerService, private utilsSrv: UtilsService) {

    this.newMechanic.email = "";
    this.newMechanic.password = "";
    this.newMechanic.password_confirm = "";
    this.newMechanic.city = "";
    this.newMechanic.concesionary = "";
    this.newMechanic.fullName = "";
    this.newMechanic.username = "";

    this.arrayCities = states;

  }

  ngOnInit() {}

  public dismissModal(){
    this.modalCtrl.dismiss();
  }

  async addMechanic(){

    // // this.dismissModal();

    // const addMechanic = await this.modalCtrl.create({
    //   component: ModalAddMechanicComponent,
    //   cssClass: 'modal-add-mechanic'
    // });

    // await addMechanic.present();

  }

  public selectMechanic(){
    this.modalCtrl.dismiss();
  }

}
