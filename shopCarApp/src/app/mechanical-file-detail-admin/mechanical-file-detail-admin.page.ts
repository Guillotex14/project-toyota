import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, Platform } from '@ionic/angular';
import { UtilsService } from '../services/utils/utils.service';
import { SellerService } from '../services/seller/seller.service';
import { MechanicalFileDetail } from 'src/models/mechanic';
import { CarDetailMechanicalFile } from 'src/models/sellet';

@Component({
  selector: 'app-mechanical-file-detail-admin',
  templateUrl: './mechanical-file-detail-admin.page.html',
  styleUrls: ['./mechanical-file-detail-admin.page.scss'],
})
export class MechanicalFileDetailAdminPage implements OnInit {

  android: boolean = false;
  ios: boolean = false;
  web: boolean = false;
  backToTop: boolean = false;
  id: string = "";
  theRoute: string = "";
  mechanicalFile: CarDetailMechanicalFile = new CarDetailMechanicalFile();
  @ViewChild(IonContent) content!: IonContent;
  constructor(private route:Router,  private platform:Platform, private actRoute:ActivatedRoute, private sellerSrv: SellerService, private utils: UtilsService) {
    this.id = this.actRoute.snapshot.params['id'];
    this.theRoute = this.actRoute.snapshot.params['route'];
    if(this.platform.is('android')){
      this.android = true;
    } else if(this.platform.is('ios')){
      this.ios = true;
    } else if(this.platform.is('mobileweb')){
      this.web = true;
    }

    this.mechanicalFile.air_conditioning_system= "";
    this.mechanicalFile.battery_status_terminals= "";
    this.mechanicalFile.bearings= "";
    this.mechanicalFile.board_lights= "";
    this.mechanicalFile.brake_bands_drums= "";
    this.mechanicalFile.brake_fluid= "";
    this.mechanicalFile.brake_pads_discs= "";
    this.mechanicalFile.brake_pipes_hoses= "";
    this.mechanicalFile.bugle_accessories= "";
    this.mechanicalFile.bushings_plateaus= "";
    this.mechanicalFile.courtesy_lights= "";
    this.mechanicalFile.dealer_maintenance= "";
    this.mechanicalFile.distribution_mail= "";
    this.mechanicalFile.engine_coolant_container= "";
    this.mechanicalFile.exhaust_pipe_bracket= "";
    this.mechanicalFile.fuel_system= "";
    this.mechanicalFile.fuel_tank_cover_pipes_hoses_connections= "";
    this.mechanicalFile.gts= "";
    this.mechanicalFile.hits= "";
    this.mechanicalFile.id_mechanic= "";
    this.mechanicalFile.id_vehicle= "";
    this.mechanicalFile.master_cylinder= "";
    this.mechanicalFile.motor_oil= "";
    this.mechanicalFile.paint_condition= "";
    this.mechanicalFile.parking_break= "";
    this.mechanicalFile.part_emblems_complete= "";
    this.mechanicalFile.radiator_status= "";
    this.mechanicalFile.radio_player= "";
    this.mechanicalFile.scratches= "";
    this.mechanicalFile.shock_absorbers_coils= "";
    this.mechanicalFile.spark_plugs_air_filter_fuel_filter_anti_pollen_filter= "";
    this.mechanicalFile.stabilizer_bar= "";
    this.mechanicalFile.stumps= "";
    this.mechanicalFile.terminals= "";
    this.mechanicalFile.tire_life= "";
    this.mechanicalFile.tire_pressure= "";
    this.mechanicalFile.transmitter_belts= "";
    this.mechanicalFile.tripoids_rubbe_bands= "";
    this.mechanicalFile.upholstery_condition= "";
    this.mechanicalFile.wiper_shower_brushes_windshield= "";
    this.mechanicalFile.headlights_lights= "";
    this.mechanicalFile.general_condition= "";

  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getMechanicFile();
  }

  public goBack(){
    this.route.navigate(['car-detail-admin/'+this.id+'/'+this.theRoute]);
  }

  public getMechanicFile(){
    let data = {
      id_vehicle: this.id
    }
    this.utils.presentLoading("Cargando...");
    this.sellerSrv.mechanicFile(data).subscribe((data:any) => {

      if(data.status){
        console.log(data);
        this.mechanicalFile = data.data;
        this.utils.dismissLoading();

      }else{
        this.utils.dismissLoading();
        this.utils.presentToast(data.message);
      }
  },
  (error: any) => {
    console.log(error);
    this.utils.dismissLoading();
    this.utils.presentToast("Error de servidor")
  });
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
