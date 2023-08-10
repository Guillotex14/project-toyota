import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { UtilsService } from '../services/utils/utils.service';
import { AdminService } from '../services/admin/admin.service';
import { SellersList } from 'src/models/admin';

@Component({
  selector: 'app-list-user-admin',
  templateUrl: './list-user-admin.page.html',
  styleUrls: ['./list-user-admin.page.scss'],
})
export class ListUserAdminPage implements OnInit {

  arraySellers: SellersList[] = [];
  auxSellers: SellersList[] = [];
  search: string = "";

  constructor(private router: Router, private menu: MenuController, private utils: UtilsService, private adminSrv: AdminService, private alertCtrl: AlertController) {
    
    this.getSellers();
  }
  
  ngOnInit() {
  }


  public goTo(){
    this.router.navigate(['home-admin']);
  }

  public openMenu() {
    this.utils.setLogin(true);
    this.menu.open();
  }

  public getSellers() {
    this.utils.presentLoading("Cargando...");
    this.adminSrv.getSellers().subscribe((res: any) => {
      if (res.status) {
        this.arraySellers = res.data;
        this.auxSellers = res.data;
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
        this.getSellers();
        this.utils.dismissLoading();
      }
    });
  }

  public editSeller(id: any) {
    this.router.navigate(['edit-user-admi/'+ id]);
  }

  public searchUser(event: any) {
    // let data = { search: event.detail.value };
    // this.adminSrv.searchSeller(data).subscribe((res: any) => {
    //   if (res.status) {
    //     this.arraySellers = res.data;
    //   }
    // });

    console.log("searchUser", event)

    let data = { search: event.detail.value };

    if (data.search == "") {
      this.auxSellers= this.arraySellers;
    }else{
      this.auxSellers = [];

      let sear;
      let sear2;
      let sear3;
      let sear4;
      let sear5;

      for (let i = 0; i < this.arraySellers.length; i++) {

        sear = this.arraySellers[i].fullName.toLowerCase();
        sear2 = this.arraySellers[i].email.toLowerCase();
        sear3 = this.arraySellers[i].city.toLowerCase();
        sear4 = this.arraySellers[i].concesionary.toLowerCase();

        if (sear.includes(data.search.toLowerCase()) || sear2.includes(data.search.toLowerCase()) || sear3.includes(data.search.toLowerCase()) || sear4.includes(data.search.toLowerCase())) {
          
          this.auxSellers.push(this.arraySellers[i]);
        }
      
      }
    }



  }

  public setSearch(event: any) {
  
    this.search = event.detail.value;
  }

}
