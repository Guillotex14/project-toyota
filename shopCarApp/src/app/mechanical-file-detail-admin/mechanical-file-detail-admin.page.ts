import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, Platform } from '@ionic/angular';
import { UtilsService } from '../services/utils/utils.service';
import { SellerService } from '../services/seller/seller.service';
import { MechanicalFileDetail } from 'src/models/mechanic';
import { CarDetailMechanicalFile } from 'src/models/sellet';
import { Browser } from '@capacitor/browser';

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
  loading: boolean = true;
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

    this.mechanicalFile.steering_wheel="";
    this.mechanicalFile.pedals="";
    this.mechanicalFile.gauges_dashboard_lights="";
    this.mechanicalFile.transmission_shift_lever="";
    this.mechanicalFile.brake_lever="";
    this.mechanicalFile.accessories="";
    this.mechanicalFile.internal_upholstery="";
    this.mechanicalFile.courtesy_lights="";
    this.mechanicalFile.windshield="";
    this.mechanicalFile.window_glass_operation="";
    this.mechanicalFile.door_locks_handles="";
    this.mechanicalFile.operation_manual_electric_mirrors="";
    this.mechanicalFile.seat_belts="";

    this.mechanicalFile.front_bumpers="";
    this.mechanicalFile.front_grill="";
    this.mechanicalFile.headlights_low_beams_cocuyos="";
    this.mechanicalFile.fog_lights="";

    this.mechanicalFile.bonnet="";
    this.mechanicalFile.engine_ignition="";
    this.mechanicalFile.engine_noises="";
    this.mechanicalFile.general_condition_fluids="";
    this.mechanicalFile.fluid_reservoirs="";
    this.mechanicalFile.spark_plugs_coils_general_condition="";
    this.mechanicalFile.air_filter="";
    this.mechanicalFile.transmission_belts="";
    this.mechanicalFile.appearance_hoses_caps_seals_connections="";
    this.mechanicalFile.battery_condition_terminal_tightness_corrosion="";
    this.mechanicalFile.fluid_leak="";
    this.mechanicalFile.general_engine_compression_condition="";

    this.mechanicalFile.stabilizer_bars="";
    this.mechanicalFile.bearings="";
    this.mechanicalFile.joints_dust_covers="";
    this.mechanicalFile.shock_absorbers="";
    this.mechanicalFile.spirals="";
    this.mechanicalFile.upper_lower_plateaus="";
    this.mechanicalFile.stumps="";
    this.mechanicalFile.terminal_blocks="";
    this.mechanicalFile.brakes="";
    this.mechanicalFile.cardan_transmission_shaft="";
    this.mechanicalFile.engine_transmission_oil_leaks="";
    this.mechanicalFile.hydraulic_oil_leak_steering_box="";
    this.mechanicalFile.excessive_rust_on_frame_compact="";
    this.mechanicalFile.exhaust_pipe="";

    this.mechanicalFile.doors="";

    this.mechanicalFile.stop="";
    this.mechanicalFile.fuel_pump_door="";
    this.mechanicalFile.trunk_door="";
    this.mechanicalFile.trunk_interior="";
    this.mechanicalFile.replacement_rubber_tool_set="";

    this.mechanicalFile.complete_emblems="";
    this.mechanicalFile.bodywork="";
    this.mechanicalFile.paint="";
    this.mechanicalFile.tire_condition="";
    this.mechanicalFile.wheel_ornaments="";
    
    this.mechanicalFile.dealer_maintenance = "";
    this.mechanicalFile.general_condition = 0;
    this.mechanicalFile.certificate = false;
    this.mechanicalFile.id_mechanic = this.id;

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
        this.loading = false;
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

  public generatePdf() {
    this.utils.presentLoading("Generando PDF...");

    this.sellerSrv.generatePdfMechanical(this.mechanicalFile.id_vehicle).subscribe(async(r: any) => {
      if (r.status) {
        this.utils.dismissLoading();
        this.utils.presentToast("PDF generado");
        await Browser.open({ url: r.data });
      } else {
        this.utils.dismissLoading();
        this.utils.presentToast(r.message);
      }
    },
      error => {
        this.utils.dismissLoading();
        this.utils.presentToast("Error de servidor");
      }  
    );
  }

}
