import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonInfiniteScroll, MenuController } from '@ionic/angular';
import { UtilsService } from '../services/utils/utils.service';
import { AdminService } from '../services/admin/admin.service';
import { SellersList } from 'src/models/admin';

@Component({
  selector: 'app-list-user-admin',
  templateUrl: './list-user-admin.page.html',
  styleUrls: ['./list-user-admin.page.scss'],
})
export class ListUserAdminPage implements OnInit {
  @ViewChild('infiniteScroll') infiniteScroll!: IonInfiniteScroll;
  arraySellers: any[] = [];
  auxSellers: any[] = [];
  search: string = "";

  countPage: number = 0;
  totalData: number = 0;

  dataSearch: any = {
    s: "",
    pos: 0,
    lim: 10
  }
  
  loading: boolean = true;

  constructor(private router: Router, private menu: MenuController, private utils: UtilsService, private adminSrv: AdminService, private alertCtrl: AlertController) {
    
  }
  
  ngOnInit() {
  }
  
  ionViewWillEnter(){
    this.utils.presentLoading("Cargando vendedores...")
    this.getSellers();
  }

  public goTo(){
    this.router.navigate(['home-admin']);
    this.dataSearch.pos = 0;
  }

  public openMenu() {
    this.utils.setLogin(true);
    this.menu.open();
  }

  public getSellers() {

    this.adminSrv.allSellers(this.dataSearch).subscribe((resp:any) => {
      if (resp.status) {
        this.loading = false;
        this.arraySellers = resp.data.rows;
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


    // this.utils.presentLoading("Cargando...");
    // this.adminSrv.getSellers().subscribe((res: any) => {
    //   if (res.status) {
    //     this.arraySellers = res.data;
    //     this.auxSellers = res.data;
    //     this.utils.dismissLoading();
    //   }else{
    //     this.utils.dismissLoading();
    //     this.utils.presentToast("Sin vendedores registrados");
    //   }
    // },
    // (error) => {
    //   console.log(error);
    //   this.utils.dismissLoading();
    //   this.utils.presentToast("Error de servidor");
    // });
  }

  async presentAlert(id: any) {
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
            this.deleteSeller(id);
          }
        }
      ]
    });

    return await alert.present();
  }

  public deleteSeller(id: any) {
    this.utils.presentLoading("Eliminando...");
    let data = { id: id };
    this.adminSrv.deleteSeller(data).subscribe((res: any) => {
      if (res.status) {
        this.dataSearch.pos = 0;
        this.getSellers();
        this.utils.dismissLoading();
      }
    });
  }

  public editSeller(id: any) {
    this.router.navigate(['edit-user-admi/'+ id]);
  }

  public loadData(eve:any){
    this.dataSearch.pos+=1;
    let moreSellers = []
    
    if (this.dataSearch.pos<= this.countPage) {
      this.adminSrv.allMechanics(this.dataSearch).subscribe((resp:any)=>{
        if (resp.status) {
          if (resp.dataSearch.rows.length > 0) {
            moreSellers = resp.data.rows;
            moreSellers.map((data:any)=>{
              this.arraySellers.push(data)
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
