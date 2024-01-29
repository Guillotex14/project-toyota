import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';
import { AdminService } from '../services/admin/admin.service';
import { Router } from '@angular/router';
import { MenuController, AlertController, IonInfiniteScroll, IonModal } from '@ionic/angular';

@Component({
  selector: 'app-list-model-admin',
  templateUrl: './list-model-admin.page.html',
  styleUrls: ['./list-model-admin.page.scss'],
})
export class ListModelAdminPage implements OnInit {

  @ViewChild('modalModelEdit') modalEdit!: IonModal;
  @ViewChild('infiniteScroll') infiniteScroll!: IonInfiniteScroll;

  modelList: any[] = [];
  arrayBrands: any[] = [];
  model: any = null;
  error: boolean = false;

  search: any = {
    s: "",
    pos: 0,
    lim: 10
  }
  loading: boolean = true;
  constructor(private utils: UtilsService, private menu: MenuController, private router: Router, private adminSrv: AdminService, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getModelsList();
    this.getBrands();
  }

  public openMenu(){
    this.utils.setLogin(true);
    this.menu.open();
  }

  public goBack(){
    this.router.navigate(['home-admin'])
    this.search.pos = 0;

  }

  public getBrands(){
    this.adminSrv.allBrands().subscribe((res: any) => {
        this.arrayBrands = res.data;

      }, (err: any) => {
        console.log(err);
      });

  }

  public getModelsList(){
    this.utils.presentLoading("cargando data...")
    this.adminSrv.getModelList(this.search).subscribe((resp:any)=>{
      if (resp.status) {
        this.loading = false;
        this.utils.dismissLoading()
        this.modelList = resp.data.rows
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

  public deleteModel(id:any){
    this.adminSrv.deleteModel(id).subscribe((resp:any)=>{
      this.utils.presentLoading("Eliminando Marca")
      if (resp.status === true) {
        this.utils.presentToast("Marca eliminada exitosamente");
        this.search.pos = 0;
        this.getModelsList();
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

  public updateModel(){

    if (this.model.name === '') {
      this.error = true;
      return;
    }


    this.utils.presentLoading("Actualizando modelo de vehículo");
    this.adminSrv.updateModel(this.model).subscribe((resp:any) => {
      if (resp.status) {
        this.modalEdit.dismiss();
        this.utils.dismissLoading();
        this.utils.presentToast("Modelo de vehículo Actualizado")
        this.getModelsList();
        this.error = false;
      }else{
        this.utils.dismissLoading();
        this.utils.presentToast("Error al actualizar Modelo")
      }
    }, (error)=>{
      this.utils.dismissLoading();
      this.utils.presentToast("Error al actualizar Modelo")
    })
  }

  async showAlertDelete(id:any){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Eliminar marca',
      message: '¿Está seguro de eliminar el modelo seleccionado?',
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
            this.deleteModel(id);
          }
        }
      ]
    });

    return await alert.present();
  }

  public openModalEdit(model:any){
    this.model = model;
    this.modalEdit.present();
  }

  public closeModalEdit(){
    this.modalEdit.dismiss();
    this.model = null;
  }

  public onInput(){
    if (this.error) {
      this.error = false;
    }
  }

  public loadData(eve:any){
    this.search.pos+=1;
    let moreModels = []
    this.adminSrv.getModelList(this.search).subscribe((resp:any)=>{
      if (resp.status) {
        if (resp.data.rows.length > 0) {
          moreModels = resp.data.rows;
          moreModels.map((data:any)=>{
            this.modelList.push(data)
          })
        }
      }
    })
    this.infiniteScroll.complete();
  }
}
