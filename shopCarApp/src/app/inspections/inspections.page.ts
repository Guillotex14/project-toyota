import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils/utils.service';
import { MechanicService } from '../services/mechanic/mechanic.service';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-inspections',
  templateUrl: './inspections.page.html',
  styleUrls: ['./inspections.page.scss'],
})
export class InspectionsPage implements OnInit {

  id_mechanic: string = "";
  arrayInspections: any[] = [];
  me: any = null;

  constructor(private router: Router, private utils: UtilsService, private mechanicSrv: MechanicService, private menuctrl: MenuController, private authSrv:AuthService) {

    this.me = this.authSrv.getMeData();

  }

  ngOnInit() {
  }
  
  ionViewWillEnter(){
    this.getInspections();
  }

  public openMenu(){
    this.menuctrl.open();
  }

  public goBack(){
    this.router.navigate(['mechanic']);
  }

  public goTo(id:any){
    this.router.navigate(['car-detail-mechanic/'+id+'/inspections']);
  }

  public getInspections(){
    let data = {
      id_mechanic: this.me.id_mechanic ? this.me.id_mechanic : null
    }
    this.utils.presentLoading("Cargando...");
    this.mechanicSrv.getInspections(data).subscribe(
      (data:any) => {

        if (data.status) {
          this.arrayInspections = data.data;
          this.utils.dismissLoading();
        }else{
          this.utils.dismissLoading();
          this.utils.presentToast("Sin inspecciones para realizar");
        }

      },
      (error) => {
        console.log(error);
        this.utils.dismissLoading();
        this.utils.presentToast("Error de servidor");
      }
    )

  }

}
