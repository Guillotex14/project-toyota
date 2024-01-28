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

    this.mechanicalFile.steering_wheel={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.pedals={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.gauges_dashboard_lights={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.transmission_shift_lever={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.brake_lever={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.accessories={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.internal_upholstery={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.courtesy_lights={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.windshield={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.window_glass_operation={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.door_locks_handles={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.operation_manual_electric_mirrors={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.seat_belts={
      apply: false,
      no_apply: false,
      upgrade: false
    };

    this.mechanicalFile.front_bumpers={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.front_grill={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.headlights_low_beams_cocuyos={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.fog_lights={
      apply: false,
      no_apply: false,
      upgrade: false
    };

    this.mechanicalFile.bonnet={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.engine_ignition={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.engine_noises={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.general_condition_fluids={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.fluid_reservoirs={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.spark_plugs_coils_general_condition={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.air_filter={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.transmission_belts={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.appearance_hoses_caps_seals_connections={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.battery_condition_terminal_tightness_corrosion={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.fluid_leak={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.general_engine_compression_condition={
      apply: false,
      no_apply: false,
      upgrade: false
    };

    this.mechanicalFile.stabilizer_bars={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.bearings={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.joints_dust_covers={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.shock_absorbers={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.spirals={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.upper_lower_plateaus={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.stumps={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.terminal_blocks={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.brakes={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.cardan_transmission_shaft={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.engine_transmission_oil_leaks={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.hydraulic_oil_leak_steering_box={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.excessive_rust_on_frame_compact={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.exhaust_pipe={
      apply: false,
      no_apply: false,
      upgrade: false
    };

    this.mechanicalFile.doors={
      apply: false,
      no_apply: false,
      upgrade: false
    };

    this.mechanicalFile.stop={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.fuel_pump_door={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.trunk_door={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.trunk_interior={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.replacement_rubber_tool_set={
      apply: false,
      no_apply: false,
      upgrade: false
    };

    this.mechanicalFile.complete_emblems={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.bodywork={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.paint={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.tire_condition={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFile.wheel_ornaments={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    
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
