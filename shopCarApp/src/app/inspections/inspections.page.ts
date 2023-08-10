import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils/utils.service';
import { MechanicService } from '../services/mechanic/mechanic.service';

@Component({
  selector: 'app-inspections',
  templateUrl: './inspections.page.html',
  styleUrls: ['./inspections.page.scss'],
})
export class InspectionsPage implements OnInit, AfterViewInit {

  id_mechanic: string = "";
  arrayInspections: any[] = [];


  constructor(private router: Router, private utils: UtilsService, private mechanicSrv: MechanicService) {

    let data = localStorage.getItem('me');

    if(data != null){
      let me = JSON.parse(data);
      this.id_mechanic = me.id_mechanic;
    }

    // this.getInspections();
  }

  ngOnInit() {
    // this.getInspections();
  }

  ngAfterViewInit(){
    this.getInspections();
  }

  public goBack(){
    this.router.navigate(['mechanic']);
  }

  public goTo(id:any){
    this.router.navigate(['car-detail-mechanic/'+id+'/inspections']);
  }

  public getInspections(){
    let data = {
      id_mechanic: this.id_mechanic!
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
