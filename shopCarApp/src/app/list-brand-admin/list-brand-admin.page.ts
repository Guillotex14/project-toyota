import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';
import { AlertController, IonInfiniteScroll, IonModal, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin/admin.service';

@Component({
  selector: 'app-list-brand-admin',
  templateUrl: './list-brand-admin.page.html',
  styleUrls: ['./list-brand-admin.page.scss'],
})
export class ListBrandAdminPage implements OnInit {
  @ViewChild('modalBrandEdit') modalEdit!: IonModal;
  @ViewChild('infiniteScroll') infiniteScroll!: IonInfiniteScroll;

  brandList: any[] = [];
  brand: any = null;
  error: boolean = false;

  search: any = {
    s: "",
    pos: 0,
    lim: 10
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
    this.search.pos = 0;

  }

  public getBrandsList(){
    this.utils.presentLoading("cargando data...")
    this.adminSrv.getBrandsList(this.search).subscribe((resp:any)=>{
      console.log(resp.data)
      if (resp.status) {
        this.utils.dismissLoading()
        this.brandList = resp.data.rows
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

  public deleteBrand(id:any){
    this.adminSrv.deleteBrand(id).subscribe((resp:any)=>{
      this.utils.presentLoading("Eliminando Marca")
      if (resp.status === true) {
        this.utils.presentToast("Marca eliminada exitosamente");
        this.search.pos = 0;
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

  public loadData(eve:any){
    this.search.pos+=1;
    let moreBrands = []
    this.adminSrv.getBrandsList(this.search).subscribe((resp:any)=>{
      if (resp.status) {
        if (resp.data.rows.length > 0) {
          moreBrands = resp.data.rows;
          moreBrands.map((data:any)=>{
            this.brandList.push(data)
          })
        }
      }
    })
    this.infiniteScroll.complete();
  }
}
