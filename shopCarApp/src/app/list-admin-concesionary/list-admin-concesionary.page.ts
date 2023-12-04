import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonInfiniteScroll, MenuController } from '@ionic/angular';
import { AdminService } from '../services/admin/admin.service';
import { UtilsService } from '../services/utils/utils.service';

@Component({
  selector: 'app-list-admin-concesionary',
  templateUrl: './list-admin-concesionary.page.html',
  styleUrls: ['./list-admin-concesionary.page.scss'],
})
export class ListAdminConcesionaryPage implements OnInit {
  @ViewChild('infiniteScroll') infiniteScroll!: IonInfiniteScroll;
  arrayAdmins: any[] = [];
  auxAdmins: any[] = [];
  search: string = "";

  countPage: number = 0;
  totalData: number = 0;

  dataSearch: any = {
    s: "",
    pos: 0,
    lim: 10
  }

  loading: boolean = true;
  constructor(private router: Router, private menu: MenuController, private utils: UtilsService, private adminSrv: AdminService, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.utils.presentLoading("Cargando administradores...")
    this.getAdmins();
  }

  public openMenu() {
    this.utils.setLogin(true);
    this.menu.open();
  }

  public goTo() {
    this.utils.setLogin(true);
    this.router.navigate(['home-admin']);
  }

  public getAdmins() {

    this.adminSrv.allAdminsConcesionary(this.dataSearch).subscribe((resp:any) => {
      console.log(resp)
      if (resp.status) {
        this.loading = false;
        this.arrayAdmins = resp.data.rows;
        this.countPage = resp.data.pages;
        this.totalData = resp.data.count;
        this.utils.dismissLoading();
      }else{
        this.utils.dismissLoading();
        this.utils.presentToast("Sin vendedores registrados");
      }
    },
    (error) => {
      console.log(error);
      this.utils.dismissLoading();
      this.utils.presentToast("Error de servidor");
    });
  }

  async presentAlert(id: any) {
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
            this.deleteAdmin(id);
          }
        }
      ]
    });

    return await alert.present();
  }

  public deleteAdmin(id: any) {
    this.utils.presentLoading("Eliminando...");
    let data = { id_user: id };
    this.adminSrv.deleteAdmin(data).subscribe((res: any) => {
      if (res.status) {
        this.dataSearch.pos = 0;
        this.getAdmins();
        this.utils.dismissLoading();
      }
    });
  }

  public editAdmin(id: any) {
    this.router.navigate(['edit-admin-concesionary/'+ id]);
  }

  public loadData(eve:any){
    this.dataSearch.pos+=1;
    let moreSellers = []
    
    if (this.dataSearch.pos<= this.countPage) {
      this.adminSrv.allAdminsConcesionary(this.dataSearch).subscribe((resp:any)=>{
        if (resp.status) {
          if (resp.dataSearch.rows.length > 0) {
            moreSellers = resp.data.rows;
            moreSellers.map((data:any)=>{
              this.arrayAdmins.push(data)
            })
          }
        }
      })
      this.infiniteScroll.complete();
    }else{
      this.infiniteScroll.complete();
    }

  }

}
