import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';
import { AlertController, IonModal, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin/admin.service';

@Component({
  selector: 'app-list-brand-admin',
  templateUrl: './list-brand-admin.page.html',
  styleUrls: ['./list-brand-admin.page.scss'],
})
export class ListBrandAdminPage implements OnInit {
  @ViewChild('modalBrandEdit') modalEdit!: IonModal;
  brandList: any[] = [];
  brand: any = null;
  error: boolean = false;

  search: any = {
    s: "",
    pos: 0,
    limit: 10
  }

  constructor(private utils: UtilsService, private menu: MenuController, private router: Router, private adminSrv:AdminService, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getBrandsList();
  }

  public openMenu(){
    this.utils.setLogin(true);
    this.menu.open();
  }

  public goBack(){
    this.router.navigate(['home-admin'])
  }

  public getBrandsList(){
    this.utils.presentLoading("cargando data...")
    this.adminSrv.getBrandsList().subscribe((resp:any)=>{
      if (resp.status) {
        this.utils.dismissLoading()
        this.brandList = resp.data
      }else{
        this.utils.dismissLoading()
        this.utils.presentToast("Error al cargar datos")
      }
    },
    (error) => {
      console.log(error);
      this.utils.dismissLoading();
      this.utils.presentToast("Error de servidor");
    })
  }

  public getDetailBrand(){

  }

  public deleteBrand(id:any){
    this.adminSrv.deleteBrand(id).subscribe((resp:any)=>{
      this.utils.presentLoading("Eliminando Marca")
      if (resp.status === true) {
        this.utils.presentToast("Marca eliminada exitosamente");
        this.getBrandsList();
        setTimeout(() => {
          this.utils.dismissLoading();
        }, 500);
      }else{
        this.utils.dismissLoading();
        this.utils.presentToast("Error al eliminar la marca");
      }
    },(error)=>{
      this.utils.dismissLoading();
      this.utils.presentToast("Server Error");
    })
  }

  public updateBrand(){

    if (this.brand.name === '') {
      this.error = true;
      return;
    }


    this.utils.presentLoading("Actualizando marca");
    this.adminSrv.addBrand(this.brand).subscribe((resp:any) => {
      if (resp.status) {
        this.modalEdit.dismiss();
        this.utils.dismissLoading();
        this.utils.presentToast("Marca Actualizada")
        this.error = false;
      }else{
        this.utils.dismissLoading();
        this.utils.presentToast("Error al actualizar marca")
      }
    }, (error)=>{
      this.utils.dismissLoading();
      this.utils.presentToast("Error al actualizar marca")
    })
  }

  async showAlertDelete(id:any){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Eliminar marca',
      message: '¿Está seguro de eliminar la marca marca seleccionada?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'danger',
          handler: (blah) => {}
        }, {
          text: 'Aceptar',
          cssClass: 'secondary',
          handler: () => {
            this.deleteBrand(id);
          }
        }
      ]
    });

    return await alert.present();
  }

  public openModalEdit(brand:any){
    this.brand = brand;
    this.modalEdit.present();
  }

  public closeModalEdit(){
    this.modalEdit.dismiss();
    this.brand = null;
  }

  public onInput(){
    if (this.error) {
      this.error = false;
    }
  }
}
