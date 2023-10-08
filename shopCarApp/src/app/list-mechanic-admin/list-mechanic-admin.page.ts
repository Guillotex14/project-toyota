import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';
import { AdminService } from '../services/admin/admin.service';
import { AlertController, IonInfiniteScroll, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-mechanic-admin',
  templateUrl: './list-mechanic-admin.page.html',
  styleUrls: ['./list-mechanic-admin.page.scss'],
})
export class ListMechanicAdminPage implements OnInit {

  @ViewChild('infiniteScroll') infiniteScroll!: IonInfiniteScroll;

  mechanicList: any[] = []
  data: any = {
    s:  "",
    pos: 0,
    lim: 10
  }

  constructor(private utils: UtilsService, private adminSrv: AdminService, private menu: MenuController, private router:Router, private alertCtrl: AlertController) {
    this.utils.presentLoading("Cargando Tecnicos");
  }
  
  ngOnInit() {
  }


  ionViewWillEnter(){
    this.getMechanicsList();
  }

  public goBack(){
    this.router.navigate(["home-admin"]);
  }

  public openMenu(){
    this.utils.setLogin(true);
    this.menu.open();
  }

  public getMechanicsList(){
    console.log(this.data.pos)
    this.adminSrv.allMechanics(this.data).subscribe((resp:any)=>{
      if (resp.status) {
        this.utils.dismissLoading();
        this.mechanicList = resp.data.rows;
      }else{
        this.utils.dismissLoading();
        this.utils.presentToast("Error al cargar Tecnicos")
      }
    },(error)=>{
      this.utils.dismissLoading();
      this.utils.presentToast("Error al cargar Tecnicos")
    
    })
  }

  public getDetailMechanic(){

  }

  public deleteMechanic(id:any){

  }

  async showAlertDelete(id:any) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Tecnico',
      message: '¿Está seguro de eliminar al tecnico seleccionado?',
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
            this.deleteMechanic(id);
          }
        }
      ]
    });
  
    await alert.present();
  }


  public onDelete(){

  }

  public editMechanic(id:any){

  }

  public loadData(eve:any){
    this.data.pos+=1;
    let moreMechanics = []
    this.adminSrv.allMechanics(this.data).subscribe((resp:any)=>{
      if (resp.status) {
        if (resp.data.rows.length > 0) {

          moreMechanics = resp.data.rows;
          moreMechanics.map((data:any)=>{
            this.mechanicList.push(data)
          })

        }
      }
    })
    this.infiniteScroll.complete();
  }
  
}


