import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalAddMechanicComponent } from '../modal-add-mechanic/modal-add-mechanic.component';
import { SellerService } from 'src/app/services/seller/seller.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-modal-mechanic',
  templateUrl: './modal-mechanic.component.html',
  styleUrls: ['./modal-mechanic.component.scss'],
})
export class ModalMechanicComponent  implements OnInit {

  arrayMechanics: any[] = [];
  @Input() data: string = "";
  // concesionary: string = "";
  
  constructor(private modalCtrl: ModalController, private sellerSrv: SellerService, private utils: UtilsService, ) {
    this.getMechanics();
    // obteniendo input desde el modal
    
    console.log("concesionario que viene de add vehicle", this.data)
  }

  ngOnInit() {
    // this.concesionary = this.conce;
    // console.log("desde oninit", this.concesionary)
    // console.log("desde oninit", this.conce)
  }

  public getMechanics(){
    this.utils.presentLoading('Cargando tecnicos...');
    this.sellerSrv.getMechanics().subscribe((data: any) => {
      console.log(data)
      if (data.status) {
        this.arrayMechanics = data.data;
        this.utils.dismissLoading();
      }
    }, error => {
      this.utils.dismissLoading();
      this.utils.presentToast('Error al cargar los tecnicos, intente nuevamente');
    });
  }

  public dismissModal(){
    this.modalCtrl.dismiss({
      id_mechanic: ''
    });
  }

  public async addMechanic(){

    // this.dismissModal();

    const addMechanic = await this.modalCtrl.create({
      component: ModalAddMechanicComponent,
      cssClass: 'modal-add-mechanic'
    });

    await addMechanic.present();

  }

  public selectMechanic(id_mechanic: string){
    this.utils.presentLoading('Seleccionando tecnico...');
    this.modalCtrl.dismiss({
      id_mechanic: id_mechanic
    });
  }


}
