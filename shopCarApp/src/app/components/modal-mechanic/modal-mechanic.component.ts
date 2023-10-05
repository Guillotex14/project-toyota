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
  }

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.getMechanics();
  }

  public getMechanics(){
    this.utils.presentLoading('Cargando técnicos...');
    this.sellerSrv.getMechanics().subscribe((data: any) => {
      if (data.status) {
        this.arrayMechanics = data.data;
        this.utils.dismissLoading();
      }
    }, error => {
      this.utils.dismissLoading();
      this.utils.presentToast('Error al cargar los técnicos, intente nuevamente');
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
    this.utils.presentLoading('Seleccionando técnico...');
    this.modalCtrl.dismiss({
      id_mechanic: id_mechanic
    });
  }


}
