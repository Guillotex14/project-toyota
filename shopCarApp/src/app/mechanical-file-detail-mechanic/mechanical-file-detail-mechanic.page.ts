import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, Platform } from '@ionic/angular';
import { MechanicService } from '../services/mechanic/mechanic.service';
import { MechanicalFileDetail } from 'src/models/mechanic';
import { UtilsService } from '../services/utils/utils.service';

@Component({
  selector: 'app-mechanical-file-detail-mechanic',
  templateUrl: './mechanical-file-detail-mechanic.page.html',
  styleUrls: ['./mechanical-file-detail-mechanic.page.scss'],
})
export class MechanicalFileDetailMechanicPage implements OnInit {
  android: boolean = false;
  ios: boolean = false;
  web: boolean = false;
  backToTop: boolean = false;
  id: string = "";
  theRoute: string = "";
  mechanicalFileDetail: MechanicalFileDetail = new MechanicalFileDetail();
  @ViewChild(IonContent) content!: IonContent;

  constructor(private platform:Platform, private route:Router, private actRoute: ActivatedRoute, private mechanicSrv: MechanicService, private utils: UtilsService) {
    
    this.id = this.actRoute.snapshot.params['id']
    this.theRoute = this.actRoute.snapshot.params['route']
    if(platform.is('android')){
      this.android = true;
    } else if(platform.is('ios')){
      this.ios = true;
    } else if(platform.is('mobileweb')){
      this.web = true;
    }

    this.mechanicalFileDetail.air_conditioning_system= "";
    this.mechanicalFileDetail.battery_status_terminals= "";
    this.mechanicalFileDetail.bearings= "";
    this.mechanicalFileDetail.board_lights= "";
    this.mechanicalFileDetail.brake_bands_drums= "";
    this.mechanicalFileDetail.brake_fluid= "";
    this.mechanicalFileDetail.brake_pads_discs= "";
    this.mechanicalFileDetail.brake_pipes_hoses= "";
    this.mechanicalFileDetail.bugle_accessories= "";
    this.mechanicalFileDetail.bushings_plateaus= "";
    this.mechanicalFileDetail.courtesy_lights= "";
    this.mechanicalFileDetail.dealer_maintenance= "";
    this.mechanicalFileDetail.distribution_mail= "";
    this.mechanicalFileDetail.engine_coolant_container= "";
    this.mechanicalFileDetail.exhaust_pipe_bracket= "";
    this.mechanicalFileDetail.fuel_system= "";
    this.mechanicalFileDetail.fuel_tank_cover_pipes_hoses_connections= "";
    this.mechanicalFileDetail.gts= "";
    this.mechanicalFileDetail.hits= "";
    this.mechanicalFileDetail.id_mechanic= "";
    this.mechanicalFileDetail.id_vehicle= "";
    this.mechanicalFileDetail.master_cylinder= "";
    this.mechanicalFileDetail.motor_oil= "";
    this.mechanicalFileDetail.paint_condition= "";
    this.mechanicalFileDetail.parking_break= "";
    this.mechanicalFileDetail.part_emblems_complete= "";
    this.mechanicalFileDetail.radiator_status= "";
    this.mechanicalFileDetail.radio_player= "";
    this.mechanicalFileDetail.scratches= "";
    this.mechanicalFileDetail.shock_absorbers_coils= "";
    this.mechanicalFileDetail.spark_plugs_air_filter_fuel_filter_anti_pollen_filter= "";
    this.mechanicalFileDetail.stabilizer_bar= "";
    this.mechanicalFileDetail.stumps= "";
    this.mechanicalFileDetail.terminals= "";
    this.mechanicalFileDetail.tire_life= "";
    this.mechanicalFileDetail.tire_pressure= "";
    this.mechanicalFileDetail.transmitter_belts= "";
    this.mechanicalFileDetail.tripoids_rubbe_bands= "";
    this.mechanicalFileDetail.upholstery_condition= "";
    this.mechanicalFileDetail.wiper_shower_brushes_windshield= "";
    this.mechanicalFileDetail.headlights_lights= "";
    this.mechanicalFileDetail.general_condition= "";
    
    this.getMechanicalFile();
  }


  ngOnInit() {
  }

  public goBack(){
    this.route.navigate(['car-detail-mechanic/'+this.id+'/'+this.theRoute]);
  }

  public getMechanicalFile(){
    let data = {
      id_vehicle: this.id
    }
    console.log(data)
    this.utils.presentLoading("Cargando ficha...");
    this.mechanicSrv.getMechanicalFile(data).subscribe((res:any)=>{
      console.log(res)
      if (res.status) {
        this.mechanicalFileDetail = res.data;
        this.utils.dismissLoading();
      }else{
        this.utils.dismissLoading()
        this.utils.presentToast(res.message)
      }
    }, (err:any)=>{
      console.log(err)
      this.utils.dismissLoading()
        this.utils.presentToast("Error de servidor")
    })
  }

  public getScrollPos(pos: any) {
    if (pos.detail.scrollTop > this.platform.height()) {
      this.backToTop = true;
    } else {
      this.backToTop = false;
    }
  }
  public scrollToTop() {
    this.content.scrollToTop(500);
  }

}
