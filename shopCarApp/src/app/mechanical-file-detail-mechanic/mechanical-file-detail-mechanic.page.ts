import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent, Platform } from '@ionic/angular';
import { MechanicService } from '../services/mechanic/mechanic.service';
import { MechanicalFileDetail } from 'src/models/mechanic';
import { UtilsService } from '../services/utils/utils.service';
import { AuthService } from '../services/auth/auth.service';
import { SellerService } from '../services/seller/seller.service';

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
  edit: boolean = true;
  id: string = "";
  me :any = null
  theRoute: string = "";
  loading: boolean = true;
  mechanicalFileDetail: MechanicalFileDetail = new MechanicalFileDetail();
  reportes: any[] = [];

  dataValueOne: any[] = [
    "pedals",
    "transmission_shift_lever",
    "internal_upholstery",
    "windshield",
    "window_glass_operation",
    "door_locks_handles",
    "operation_manual_electric_mirrors",
    "seat_belts",
    "front_bumpers",
    "front_grill",
    "headlights_low_beams_cocuyos",
    "fog_lights",
    "bonnet",
    "spark_plugs_coils_general_condition",
    "engine_ignition",
    "air_filter",
    "exhaust_pipe",
    "doors",
    "fuel_pump_door",
    "trunk_door",
    "trunk_interior",
    "replacement_rubber_tool_set",
    "complete_emblems",
    "tire_condition",
    "wheel_ornaments",
  ]

  dataValueTwo: any[] = [
    "steering_wheel",
    "gauges_dashboard_lights",
    "brake_lever",
    "accessories",
    "courtesy_lights",
    "general_condition_fluids",
    "fluid_reservoirs",
    "transmission_belts",
    "appearance_hoses_caps_seals_connections",
    "battery_condition_terminal_tightness_corrosion",
    "fluid_leak",
    "brakes",
    "cardan_transmission_shaft",
    "hydraulic_oil_leak_steering_box",
    "stop",
  ]

  dataValueThree: any[] = [
    "engine_noises",
    "stabilizer_bars",
    "bearings",
    "joints_dust_covers",
    "shock_absorbers",
    "spirals",
    "upper_lower_plateaus",
    "stumps",
    "terminal_blocks",
    "engine_transmission_oil_leaks",
    "excessive_rust_on_frame_compact",
    "bodywork",
    "paint",
  ]

  dataValueSix: any[] = [
    "general_engine_compression_condition",
  ]
  @ViewChild(IonContent) content!: IonContent;

  constructor(private platform:Platform, private route:Router, private actRoute: ActivatedRoute, private mechanicSrv: MechanicService, private utils: UtilsService, private authSrv: AuthService, private sellerSrv: SellerService, private alertCtrl: AlertController) {
    
    this.id = this.actRoute.snapshot.params['id']
    this.theRoute = this.actRoute.snapshot.params['route']
    if(platform.is('android')){
      this.android = true;
    } else if(platform.is('ios')){
      this.ios = true;
    } else if(platform.is('mobileweb')){
      this.web = true;
    }
    
    this.me = this.authSrv.getMeData();
    
    this.mechanicalFileDetail.vehicle = {
      price_ofert: null
    }
    this.mechanicalFileDetail.mechanic = {
      fullName: null
    }

        this.mechanicalFileDetail.steering_wheel={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.pedals={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.gauges_dashboard_lights={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.transmission_shift_lever={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.brake_lever={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.accessories={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.internal_upholstery={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.courtesy_lights={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.windshield={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.window_glass_operation={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.door_locks_handles={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.operation_manual_electric_mirrors={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.seat_belts={
      apply: false,
      no_apply: false,
      upgrade: false
    };

    this.mechanicalFileDetail.front_bumpers={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.front_grill={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.headlights_low_beams_cocuyos={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.fog_lights={
      apply: false,
      no_apply: false,
      upgrade: false
    };

    this.mechanicalFileDetail.bonnet={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.engine_ignition={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.engine_noises={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.general_condition_fluids={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.fluid_reservoirs={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.spark_plugs_coils_general_condition={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.air_filter={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.transmission_belts={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.appearance_hoses_caps_seals_connections={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.battery_condition_terminal_tightness_corrosion={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.fluid_leak={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.general_engine_compression_condition={
      apply: false,
      no_apply: false,
      upgrade: false
    };

    this.mechanicalFileDetail.stabilizer_bars={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.bearings={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.joints_dust_covers={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.shock_absorbers={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.spirals={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.upper_lower_plateaus={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.stumps={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.terminal_blocks={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.brakes={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.cardan_transmission_shaft={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.engine_transmission_oil_leaks={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.hydraulic_oil_leak_steering_box={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.excessive_rust_on_frame_compact={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.exhaust_pipe={
      apply: false,
      no_apply: false,
      upgrade: false
    };

    this.mechanicalFileDetail.doors={
      apply: false,
      no_apply: false,
      upgrade: false
    };

    this.mechanicalFileDetail.stop={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.fuel_pump_door={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.trunk_door={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.trunk_interior={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.replacement_rubber_tool_set={
      apply: false,
      no_apply: false,
      upgrade: false
    };

    this.mechanicalFileDetail.complete_emblems={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.bodywork={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.paint={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.tire_condition={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.mechanicalFileDetail.wheel_ornaments={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    
    this.mechanicalFileDetail.dealer_maintenance = "";
    this.mechanicalFileDetail.general_condition = 0;
    this.mechanicalFileDetail.certificate = false;
    this.mechanicalFileDetail.id_mechanic = this.id;
    
  }


  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getMechanicalFile();
  }

  public goBack(){
    this.route.navigate(['car-detail-mechanic/'+this.id+'/'+this.theRoute]);
  }

  public getMechanicalFile(){
    let data = {
      id_vehicle: this.id
    }

    

    this.utils.presentLoading("Cargando ficha...");
    this.mechanicSrv.getMechanicalFile(data).subscribe((res:any)=>{
      if (res.status) {
        this.loading = false;
        this.mechanicalFileDetail = res.data;
        this.utils.dismissLoading();
      }else{
        this.utils.dismissLoading()
        this.utils.presentToast(res.message)
      }
    }, (err:any)=>{
      
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

  public editFile(){
    this.edit = false;
  }

  public noEditFile(){
    this.edit = true;
  }

  public saveFile(){

    let data = {
      data: this.mechanicalFileDetail
    }
    
    if (this.onValidateForm() === false){
      return;
    }

    this.utils.presentLoading("Actualizando ficha mecánica")
    this.mechanicSrv.editFileMechanic(data).subscribe((res:any) => {

      if (res.status) {
        this.utils.dismissLoading();
        this.utils.presentToast(res.message)
        this.edit = true;
        this.scrollToTop()
        this.goBack();
      } else {
        this.utils.dismissLoading()
        this.utils.presentToast(res.message)
      }

    },(error)=>{
      this.utils.dismissLoading()
        this.utils.presentToast("Error de servidor")
    })
  }

  public generalCondition(event: any, field: any, name:string,input:string){
    
    if (event.detail.checked === true) {
    //   //buscamos el campo en los arreglos para saber cual es su valor y sumarlos       
      if (this.dataValueOne.includes(name)) {
        if (field.apply === true && field.upgrade === false && field.no_apply === false) {
          this.mechanicalFileDetail.general_condition+=1;
        }

        if (field.upgrade === true && field.apply === false && field.no_apply === false) {
          this.mechanicalFileDetail.general_condition+=1;
        }

        if ( field.no_apply === true && field.apply === false && field.upgrade === false ) {
          this.mechanicalFileDetail.general_condition+=0;
        }
        
        if ( field.no_apply === true && field.apply === true && field.upgrade === false) {
          if (this.mechanicalFileDetail.general_condition > 0) {
            this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 1;
          }
        }

        if ( field.no_apply === true && field.apply === false && field.upgrade === true) {
          if (this.mechanicalFileDetail.general_condition > 0) {
            this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 1;
          }
        }

        if ( field.no_apply === true && field.apply === true && field.upgrade === true) {
          if (this.mechanicalFileDetail.general_condition > 0) {
            this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 1;
          }
        }

      }

      if (this.dataValueTwo.includes(name)) {
        
        if (field.apply === true && field.upgrade === false && field.no_apply === false) {
          this.mechanicalFileDetail.general_condition+=2;
        }

        if (field.upgrade === true && field.apply === false && field.no_apply === false) {
          this.mechanicalFileDetail.general_condition+=2;
        }

        if ( field.no_apply === true && field.apply === false && field.upgrade === false ) {
          this.mechanicalFileDetail.general_condition+=0;
        }

        if ( field.no_apply === true && field.apply === true && field.upgrade === false) {
          if (this.mechanicalFileDetail.general_condition > 0) {
            this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 2;
          }
        }

        if ( field.no_apply === true && field.apply === false && field.upgrade === true) {
          if (this.mechanicalFileDetail.general_condition > 0) {
            this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 2;
          }
        }

        if ( field.no_apply === true && field.apply === true && field.upgrade === true) {
          if (this.mechanicalFileDetail.general_condition > 0) {
            this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 2;
          }
        }

      }

      if (this.dataValueThree.includes(name)) {
        
        if (field.apply === true && field.upgrade === false && field.no_apply === false) {
          this.mechanicalFileDetail.general_condition+=3;
        }

        if (field.upgrade === true && field.apply === false && field.no_apply === false) {
          this.mechanicalFileDetail.general_condition+=3;
        }

        if ( field.no_apply === true && field.apply === false && field.upgrade === false ) {
          this.mechanicalFileDetail.general_condition+=0;
        }

        if ( field.no_apply === true && field.apply === true && field.upgrade === false) {
          if (this.mechanicalFileDetail.general_condition > 0) {
            this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 3;
          }
        }

        if ( field.no_apply === true && field.apply === false && field.upgrade === true) {
          if (this.mechanicalFileDetail.general_condition > 0) {
            this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 3;
          }
        }

        if ( field.no_apply === true && field.apply === true && field.upgrade === true) {
          if (this.mechanicalFileDetail.general_condition > 0) {
            this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 3;
          }
        }

      }

      if (this.dataValueSix.includes(name)) {
        
        if (field.apply === true && field.upgrade === false && field.no_apply === false) {
          this.mechanicalFileDetail.general_condition+=6;
        }

        if (field.upgrade === true && field.apply === false && field.no_apply === false) {
          this.mechanicalFileDetail.general_condition+=6;
        }

        if ( field.no_apply === true && field.apply === false && field.upgrade === false ) {
          this.mechanicalFileDetail.general_condition+=0;
        }

        if ( field.no_apply === true && field.apply === true && field.upgrade === false) {
          if (this.mechanicalFileDetail.general_condition > 0) {
            this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 6;
          }
        }

        if ( field.no_apply === true && field.apply === false && field.upgrade === true) {
          if (this.mechanicalFileDetail.general_condition > 0) {
            this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 6;
          }
        }

        if ( field.no_apply === true && field.apply === true && field.upgrade === true) {
          if (this.mechanicalFileDetail.general_condition > 0) {
            this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 6;
          }
        }
      }
    }

    if (event.detail.checked === false) {
      //buscamos el campo en los arreglos para saber cual es su valor y restarlos      
      if (this.dataValueOne.includes(name)) {
        if (field.apply === false && field.upgrade === false && input !== 'no_apply' ) {
          if (this.mechanicalFileDetail.general_condition > 0) {
            this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 1;
          }
        }

      }

      if (this.dataValueTwo.includes(name)) {
        
        if (field.apply === false && field.upgrade === false  && input !== 'no_apply' ) {
          if (this.mechanicalFileDetail.general_condition > 0) {
            this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 2;
          }
        }
      }

      if (this.dataValueThree.includes(name)) {
        
        if (field.apply === false && field.upgrade === false  && input !== 'no_apply' ) {
          if (this.mechanicalFileDetail.general_condition > 0) {
            this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 3;
          }
        }
      }

      if (this.dataValueSix.includes(name)) {
        
        if (field.apply === false && field.upgrade === false  && input !== 'no_apply' ) {
          if (this.mechanicalFileDetail.general_condition > 0) {
            this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 6;
          }
        }

        if (field.upgrade === false && field.apply === false  && input !== 'no_apply' ) {
          
          if (this.mechanicalFileDetail.general_condition > 0) {
            this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 6;
          }
          
        }
      }
    }

  }

  public onCheckNoApply(event: any, field: any, name:string){
    if(event.detail.checked == true){
      field.apply = false;
      field.no_apply = true;
      field.upgrade = false;
      
      if (this.dataValueOne.includes(name)) {
        if (this.mechanicalFileDetail.general_condition > 0) {
          this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 1;
          
        }
      }

      if (this.dataValueTwo.includes(name)) {
        
        if (this.mechanicalFileDetail.general_condition > 0) {
          this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 2;
        }
        
      }

      if (this.dataValueThree.includes(name)) {
        
        if (this.mechanicalFileDetail.general_condition > 0) {
          this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 3;
        }
      }

      if (this.dataValueSix.includes(name)) {
        
        if (this.mechanicalFileDetail.general_condition > 0) {
          this.mechanicalFileDetail.general_condition = this.mechanicalFileDetail.general_condition - 6;
        }
      }
    }
  }

  public onCheckApply(event: any, field: any){
    if(field.no_apply == true){
      field.apply = false;
      field.upgrade = false;
    }
  }

  public onCheckUpgrade(event: any, field: any){
    if(field.no_apply == true){
      field.apply = false;
      field.upgrade = false;
    }
  }

  public onValidateForm(){

    if(this.mechanicalFileDetail.steering_wheel === undefined || this.mechanicalFileDetail.steering_wheel === null || this.mechanicalFileDetail.steering_wheel.apply === false && this.mechanicalFileDetail.steering_wheel.no_apply === false && this.mechanicalFileDetail.steering_wheel.upgrade === false){
      this.utils.presentToast("El campo Volante es requerido");
      return false;
    }

    if(this.mechanicalFileDetail.pedals === undefined || this.mechanicalFileDetail.pedals === null || this.mechanicalFileDetail.pedals.apply === false && this.mechanicalFileDetail.pedals.no_apply === false && this.mechanicalFileDetail.pedals.upgrade === false){
      this.utils.presentToast("El campo Pedales es requerido");
      return false;
    }

    if(this.mechanicalFileDetail.gauges_dashboard_lights === undefined || this.mechanicalFileDetail.gauges_dashboard_lights === null || this.mechanicalFileDetail.gauges_dashboard_lights.apply === false && this.mechanicalFileDetail.gauges_dashboard_lights.no_apply === false && this.mechanicalFileDetail.gauges_dashboard_lights.upgrade === false){
      this.utils.presentToast("El campo Medidores y luces del tablero es requerido");
      return false;
    }

    if(this.mechanicalFileDetail.transmission_shift_lever === undefined || this.mechanicalFileDetail.transmission_shift_lever === null || this.mechanicalFileDetail.transmission_shift_lever.apply === false && this.mechanicalFileDetail.transmission_shift_lever.no_apply === false && this.mechanicalFileDetail.transmission_shift_lever.upgrade === false){
      this.utils.presentToast("El campo Palanca de cambio de transmisión es requerido");
      return false;
    }

    if(this.mechanicalFileDetail.brake_lever === undefined || this.mechanicalFileDetail.brake_lever === null || this.mechanicalFileDetail.brake_lever.apply === false && this.mechanicalFileDetail.brake_lever.no_apply === false && this.mechanicalFileDetail.brake_lever.upgrade === false){
      this.utils.presentToast("El campo Palanca de freno es requerido");
      return false;
    }

    if(this.mechanicalFileDetail.accessories === undefined || this.mechanicalFileDetail.accessories === null || this.mechanicalFileDetail.accessories.apply === false && this.mechanicalFileDetail.accessories.no_apply === false && this.mechanicalFileDetail.accessories.upgrade === false){
      this.utils.presentToast("El campo Accesorios es requerido");
      return false;
    }


    if(this.mechanicalFileDetail.internal_upholstery === undefined || this.mechanicalFileDetail.internal_upholstery === null || this.mechanicalFileDetail.internal_upholstery.apply === false && this.mechanicalFileDetail.internal_upholstery.no_apply === false && this.mechanicalFileDetail.internal_upholstery.upgrade === false){
      this.utils.presentToast("El campo Tapicería interna es requerido");
      return false;
    }

    if(this.mechanicalFileDetail.courtesy_lights === undefined || this.mechanicalFileDetail.courtesy_lights === null || this.mechanicalFileDetail.courtesy_lights.apply === false && this.mechanicalFileDetail.courtesy_lights.no_apply === false && this.mechanicalFileDetail.courtesy_lights.upgrade === false){
      this.utils.presentToast("El campo BLuces de cortesía es requerido");
      return false;
    }

    if(this.mechanicalFileDetail.windshield === undefined || this.mechanicalFileDetail.windshield === null || this.mechanicalFileDetail.windshield.apply === false && this.mechanicalFileDetail.windshield.no_apply === false && this.mechanicalFileDetail.windshield.upgrade === false){
      this.utils.presentToast("El campo Parabrisas es requerido");
      return false;
    }

    if(this.mechanicalFileDetail.window_glass_operation === undefined || this.mechanicalFileDetail.window_glass_operation === null || this.mechanicalFileDetail.window_glass_operation.apply === false && this.mechanicalFileDetail.window_glass_operation.no_apply === false && this.mechanicalFileDetail.window_glass_operation.upgrade === false){
      this.utils.presentToast("El campo Funcionamiento de vidrios de ventana es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.door_locks_handles === undefined || this.mechanicalFileDetail.door_locks_handles === null || this.mechanicalFileDetail.door_locks_handles.apply === false && this.mechanicalFileDetail.door_locks_handles.no_apply === false && this.mechanicalFileDetail.door_locks_handles.upgrade === false){
      this.utils.presentToast("El campo Seguros y manillas de puerta es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.operation_manual_electric_mirrors === undefined || this.mechanicalFileDetail.operation_manual_electric_mirrors === null || this.mechanicalFileDetail.operation_manual_electric_mirrors.apply === false && this.mechanicalFileDetail.operation_manual_electric_mirrors.no_apply === false && this.mechanicalFileDetail.operation_manual_electric_mirrors.upgrade === false){
      this.utils.presentToast("El campo Operación de Retrovisores manuales o eléctricos es requerido")
      return false;
    }


    if(this.mechanicalFileDetail.seat_belts === undefined || this.mechanicalFileDetail.seat_belts === null || this.mechanicalFileDetail.seat_belts.apply === false && this.mechanicalFileDetail.seat_belts.no_apply === false && this.mechanicalFileDetail.seat_belts.upgrade === false){
      this.utils.presentToast("El campo Cinturones de Seguridad es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.front_bumpers === undefined || this.mechanicalFileDetail.front_bumpers === null || this.mechanicalFileDetail.front_bumpers.apply === false && this.mechanicalFileDetail.front_bumpers.no_apply === false && this.mechanicalFileDetail.front_bumpers.upgrade === false){
      this.utils.presentToast("El campo Parachoques delanteros es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.front_grill === undefined || this.mechanicalFileDetail.front_grill === null || this.mechanicalFileDetail.front_grill.apply === false && this.mechanicalFileDetail.front_grill.no_apply === false && this.mechanicalFileDetail.front_grill.upgrade === false){
      this.utils.presentToast("El campo Parrilla frontal es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.headlights_low_beams_cocuyos === undefined || this.mechanicalFileDetail.headlights_low_beams_cocuyos === null || this.mechanicalFileDetail.headlights_low_beams_cocuyos.apply === false && this.mechanicalFileDetail.headlights_low_beams_cocuyos.no_apply === false && this.mechanicalFileDetail.headlights_low_beams_cocuyos.upgrade === false){
      this.utils.presentToast("El campo Faros, luces de cruce y cocuyos es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.fog_lights === undefined || this.mechanicalFileDetail.fog_lights === null || this.mechanicalFileDetail.fog_lights.apply === false && this.mechanicalFileDetail.fog_lights.no_apply === false && this.mechanicalFileDetail.fog_lights.upgrade === false){
      this.utils.presentToast("El campo Faros antinieblas es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.bonnet === undefined || this.mechanicalFileDetail.bonnet === null || this.mechanicalFileDetail.bonnet.apply === false && this.mechanicalFileDetail.bonnet.no_apply === false && this.mechanicalFileDetail.bonnet.upgrade === false){
      this.utils.presentToast("El campo Capot es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.engine_ignition === undefined || this.mechanicalFileDetail.engine_ignition === null || this.mechanicalFileDetail.engine_ignition.apply === false && this.mechanicalFileDetail.engine_ignition.no_apply === false && this.mechanicalFileDetail.engine_ignition.upgrade === false){
      this.utils.presentToast("El campo Encendido del motor es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.engine_noises === undefined || this.mechanicalFileDetail.engine_noises === null || this.mechanicalFileDetail.engine_noises.apply === false && this.mechanicalFileDetail.engine_noises.no_apply === false && this.mechanicalFileDetail.engine_noises.upgrade === false){
      this.utils.presentToast("El campo Ruidos de motor es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.general_condition_fluids === undefined || this.mechanicalFileDetail.general_condition_fluids === null || this.mechanicalFileDetail.general_condition_fluids.apply === false && this.mechanicalFileDetail.general_condition_fluids.no_apply === false && this.mechanicalFileDetail.general_condition_fluids.upgrade === false){
      this.utils.presentToast("El campo Fluidos estado general es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.fluid_reservoirs === undefined || this.mechanicalFileDetail.fluid_reservoirs === null || this.mechanicalFileDetail.fluid_reservoirs.apply === false && this.mechanicalFileDetail.fluid_reservoirs.no_apply === false && this.mechanicalFileDetail.fluid_reservoirs.upgrade === false){
      this.utils.presentToast("El campo Depósitos de fluidos es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.spark_plugs_coils_general_condition === undefined || this.mechanicalFileDetail.spark_plugs_coils_general_condition === null || this.mechanicalFileDetail.spark_plugs_coils_general_condition.apply === false && this.mechanicalFileDetail.spark_plugs_coils_general_condition.no_apply === false && this.mechanicalFileDetail.spark_plugs_coils_general_condition.upgrade === false){
      this.utils.presentToast("El campo Bujías y bobinas condición general es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.air_filter === undefined || this.mechanicalFileDetail.air_filter === null || this.mechanicalFileDetail.air_filter.apply === false && this.mechanicalFileDetail.air_filter.no_apply === false && this.mechanicalFileDetail.air_filter.upgrade === false){
      this.utils.presentToast("El campo Filtro de aire es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.transmission_belts === undefined || this.mechanicalFileDetail.transmission_belts === null || this.mechanicalFileDetail.transmission_belts.apply === false && this.mechanicalFileDetail.transmission_belts.no_apply === false && this.mechanicalFileDetail.transmission_belts.upgrade === false){
      this.utils.presentToast("El campo Correas de transmisión es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.appearance_hoses_caps_seals_connections === undefined || this.mechanicalFileDetail.appearance_hoses_caps_seals_connections === null || this.mechanicalFileDetail.appearance_hoses_caps_seals_connections.apply === false && this.mechanicalFileDetail.appearance_hoses_caps_seals_connections.no_apply === false && this.mechanicalFileDetail.appearance_hoses_caps_seals_connections.upgrade === false){
      this.utils.presentToast("El campo apariencia Mangueras, tapas, sellos y conexiones es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.battery_condition_terminal_tightness_corrosion === undefined || this.mechanicalFileDetail.battery_condition_terminal_tightness_corrosion === null || this.mechanicalFileDetail.battery_condition_terminal_tightness_corrosion.apply === false && this.mechanicalFileDetail.battery_condition_terminal_tightness_corrosion.no_apply === false && this.mechanicalFileDetail.battery_condition_terminal_tightness_corrosion.upgrade === false){
      this.utils.presentToast("El campo Estado de la batería es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.fluid_leak === undefined || this.mechanicalFileDetail.fluid_leak === null || this.mechanicalFileDetail.fluid_leak.apply === false && this.mechanicalFileDetail.fluid_leak.no_apply === false && this.mechanicalFileDetail.fluid_leak.upgrade === false){
      this.utils.presentToast("El campo Fuga de fluidos es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.id_mechanic === undefined || this.mechanicalFileDetail.id_mechanic === null || this.mechanicalFileDetail.id_mechanic === ""){
      this.utils.presentToast("El campo id del Técnico es requerido")
      return false;
    }
    
    if(this.mechanicalFileDetail.id_vehicle === undefined || this.mechanicalFileDetail.id_vehicle === null || this.mechanicalFileDetail.id_vehicle === ""){

      this.utils.presentToast("El campo id del vehículo es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.general_engine_compression_condition === undefined || this.mechanicalFileDetail.general_engine_compression_condition === null || this.mechanicalFileDetail.general_engine_compression_condition === "" || this.mechanicalFileDetail.general_engine_compression_condition === 0){

      this.utils.presentToast("El campo Condición general de la compresión del motor es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.stabilizer_bars === undefined || this.mechanicalFileDetail.stabilizer_bars === null || this.mechanicalFileDetail.stabilizer_bars.apply === false && this.mechanicalFileDetail.stabilizer_bars.no_apply === false && this.mechanicalFileDetail.stabilizer_bars.upgrade === false){

      this.utils.presentToast("El campo Barras estabilizadoras es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.bearings === undefined || this.mechanicalFileDetail.bearings === null || this.mechanicalFileDetail.bearings.apply === false && this.mechanicalFileDetail.bearings.no_apply === false && this.mechanicalFileDetail.bearings.upgrade === false){

      this.utils.presentToast("El campo Rodamientos es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.joints_dust_covers === undefined || this.mechanicalFileDetail.joints_dust_covers === null || this.mechanicalFileDetail.joints_dust_covers.apply === false && this.mechanicalFileDetail.joints_dust_covers.no_apply === false && this.mechanicalFileDetail.joints_dust_covers.upgrade === false){

      this.utils.presentToast("El campo Juntas homocinéticas y guardapolvos es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.shock_absorbers === undefined || this.mechanicalFileDetail.shock_absorbers === null || this.mechanicalFileDetail.shock_absorbers.apply === false && this.mechanicalFileDetail.shock_absorbers.no_apply === false && this.mechanicalFileDetail.shock_absorbers.upgrade === false){

      this.utils.presentToast("El campo Amortiguadores es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.spirals === undefined || this.mechanicalFileDetail.spirals === null || this.mechanicalFileDetail.spirals.apply === false && this.mechanicalFileDetail.spirals.no_apply === false && this.mechanicalFileDetail.spirals.upgrade === false){

      this.utils.presentToast("El campo Espirales es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.upper_lower_plateaus === undefined || this.mechanicalFileDetail.upper_lower_plateaus === null || this.mechanicalFileDetail.upper_lower_plateaus.apply === false && this.mechanicalFileDetail.upper_lower_plateaus.no_apply === false && this.mechanicalFileDetail.upper_lower_plateaus.upgrade === false){

      this.utils.presentToast("El campo Mesetas sup.e inf. es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.stumps === undefined || this.mechanicalFileDetail.stumps === null || this.mechanicalFileDetail.stumps.apply === false && this.mechanicalFileDetail.stumps.no_apply === false && this.mechanicalFileDetail.stumps.upgrade === false){

      this.utils.presentToast("El campo Muñones es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.terminal_blocks === undefined || this.mechanicalFileDetail.terminal_blocks === null || this.mechanicalFileDetail.terminal_blocks.apply === false && this.mechanicalFileDetail.terminal_blocks.no_apply === false && this.mechanicalFileDetail.terminal_blocks.upgrade === false){

      this.utils.presentToast("El campo Terminales de dirección es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.brakes === undefined || this.mechanicalFileDetail.brakes === null || this.mechanicalFileDetail.brakes.apply === false && this.mechanicalFileDetail.brakes.no_apply === false && this.mechanicalFileDetail.brakes.upgrade === false){

      this.utils.presentToast("El campo Frenos es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.cardan_transmission_shaft === undefined || this.mechanicalFileDetail.cardan_transmission_shaft === null || this.mechanicalFileDetail.cardan_transmission_shaft.apply === false && this.mechanicalFileDetail.cardan_transmission_shaft.no_apply === false && this.mechanicalFileDetail.cardan_transmission_shaft.upgrade === false){

      this.utils.presentToast("El campo Cardan o Eje de Transmisión es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.engine_transmission_oil_leaks === undefined || this.mechanicalFileDetail.engine_transmission_oil_leaks === undefined || this.mechanicalFileDetail.engine_transmission_oil_leaks.apply === false && this.mechanicalFileDetail.engine_transmission_oil_leaks.no_apply === false && this.mechanicalFileDetail.engine_transmission_oil_leaks.updagrade === false){

      this.utils.presentToast("El campo Fugas de aceite de motor/transmisión es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.hydraulic_oil_leak_steering_box === undefined || this.mechanicalFileDetail.hydraulic_oil_leak_steering_box === null || this.mechanicalFileDetail.hydraulic_oil_leak_steering_box.apply === false && this.mechanicalFileDetail.hydraulic_oil_leak_steering_box.no_apply === false && this.mechanicalFileDetail.hydraulic_oil_leak_steering_box.upgrade === false){

      this.utils.presentToast("El campo Fuga de aceite hidráulico  en cajetín de dirección es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.excessive_rust_on_frame_compact === undefined || this.mechanicalFileDetail.excessive_rust_on_frame_compact === null || this.mechanicalFileDetail.excessive_rust_on_frame_compact.apply === false && this.mechanicalFileDetail.excessive_rust_on_frame_compact.no_apply === false && this.mechanicalFileDetail.excessive_rust_on_frame_compact.upgrade === false){

      this.utils.presentToast("El campo Oxido excesivo en el bastidor o compacto es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.exhaust_pipe === undefined || this.mechanicalFileDetail.exhaust_pipe === null || this.mechanicalFileDetail.exhaust_pipe.apply === false && this.mechanicalFileDetail.exhaust_pipe.no_apply === false && this.mechanicalFileDetail.exhaust_pipe.upgrade === false){

      this.utils.presentToast("El campo Tubo de escape es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.doors === undefined || this.mechanicalFileDetail.doors === null || this.mechanicalFileDetail.doors.apply === false && this.mechanicalFileDetail.doors.no_apply === false && this.mechanicalFileDetail.doors.upgrade === false){

      this.utils.presentToast("El campo Puertas es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.stop === undefined || this.mechanicalFileDetail.stop === null || this.mechanicalFileDetail.stop.apply === false && this.mechanicalFileDetail.stop.no_apply === false && this.mechanicalFileDetail.stop.upgrade === false){

      this.utils.presentToast("El campo Stop es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.fuel_pump_door === undefined || this.mechanicalFileDetail.fuel_pump_door === null || this.mechanicalFileDetail.fuel_pump_door.apply === false && this.mechanicalFileDetail.fuel_pump_door.no_apply === false && this.mechanicalFileDetail.fuel_pump_door.upgrade === false){

      this.utils.presentToast("El campo Compuerta del surtidor de combustible es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.trunk_door === undefined || this.mechanicalFileDetail.trunk_door === null || this.mechanicalFileDetail.trunk_door.apply === false && this.mechanicalFileDetail.trunk_door.no_apply === false && this.mechanicalFileDetail.trunk_door.upgrade === false){

      this.utils.presentToast("El campo Puerta del Maletero es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.trunk_interior === undefined || this.mechanicalFileDetail.trunk_interior === null || this.mechanicalFileDetail.trunk_interior.apply === false && this.mechanicalFileDetail.trunk_interior.no_apply === false && this.mechanicalFileDetail.trunk_interior.upgrade === false){

      this.utils.presentToast("El campo Interior del Maletero es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.replacement_rubber_tool_set === undefined || this.mechanicalFileDetail.replacement_rubber_tool_set === null || this.mechanicalFileDetail.replacement_rubber_tool_set.apply === false && this.mechanicalFileDetail.replacement_rubber_tool_set.no_apply === false && this.mechanicalFileDetail.replacement_rubber_tool_set.upgrade === false){

      this.utils.presentToast("El campo Caucho de repuesto y Juego de Herramientas es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.complete_emblems === undefined || this.mechanicalFileDetail.complete_emblems === null || this.mechanicalFileDetail.complete_emblems.apply === false && this.mechanicalFileDetail.complete_emblems.no_apply === false && this.mechanicalFileDetail.complete_emblems.upgrade === false){

      this.utils.presentToast("El campo Emblemas completos es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.bodywork === undefined || this.mechanicalFileDetail.bodywork === null || this.mechanicalFileDetail.bodywork.apply === false && this.mechanicalFileDetail.bodywork.no_apply === false && this.mechanicalFileDetail.bodywork.upgrade === false){

      this.utils.presentToast("El campo Carrocería es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.paint === undefined || this.mechanicalFileDetail.paint === null || this.mechanicalFileDetail.paint.apply === false && this.mechanicalFileDetail.paint.no_apply === false && this.mechanicalFileDetail.paint.upgrade === false){

      this.utils.presentToast("El campo Pintura es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.tire_condition === undefined || this.mechanicalFileDetail.tire_condition === null || this.mechanicalFileDetail.tire_condition.apply === false && this.mechanicalFileDetail.tire_condition.no_apply === false && this.mechanicalFileDetail.tire_condition.upgrade === false){

      this.utils.presentToast("El campo Estado de los neumáticos es requerido")
      return false;
    }

    if(this.mechanicalFileDetail.wheel_ornaments === undefined || this.mechanicalFileDetail.wheel_ornaments === null || this.mechanicalFileDetail.wheel_ornaments.apply === false && this.mechanicalFileDetail.wheel_ornaments.no_apply === false && this.mechanicalFileDetail.wheel_ornaments.upgrade === false){

      this.utils.presentToast("El campo Ornamentos de ruedas es requerido")
      return false;
    }

    // if(this.mechanicalFileDetail.dealer_maintenance === undefined || this.mechanicalFileDetail.dealer_maintenance === null || this.mechanicalFileDetail.dealer_maintenance === ""){
    //   this.utils.presentToast("El campo Mantenimiento en concesionario es requerido");
    //   return false;
    // }

    return true;
  }

  public getListReport(data: any) {
    this.sellerSrv.getReportList({ id: data._id }).subscribe((r: any) => {
      if (r.status) {
        this.reportes = r.data;
        for (let i = 0; i < this.reportes.length; i++) {
          this.reportes[i].showcontent = true;
          this.reportes[i].campos_actualizados_list = [];
          this.reportes[i].show_actualizados_list = false;
          for (const clave in this.reportes[i].campos_actualizados) {
            this.reportes[i].campos_actualizados_list.push(`${clave}: ${this.reportes[i].campos_actualizados[clave]}`);
          }
          this.reportes[i].campos_anteriores_list = [];
          this.reportes[i].show_anteriores_list = false;
          for (const clave in this.reportes[i].campos_anteriores) {
            this.reportes[i].campos_anteriores_list.push(`${clave}: ${this.reportes[i].campos_anteriores[clave]}`);
          }
        }
      }
    });
  }

  public seeCamposActualizados(item: any) {
    for (let i = 0; i < this.reportes.length; i++) {
      if (this.reportes[i]._id == item._id) {
        this.reportes[i].showcontent = !this.reportes[i].showcontent
        this.reportes[i].show_actualizados_list = !this.reportes[i].show_actualizados_list;
      }
    }
  }

  public seeCamposAnteriores(item: any) {
    for (let i = 0; i < this.reportes.length; i++) {
      if (this.reportes[i]._id == item._id) {
        this.reportes[i].showcontent = !this.reportes[i].showcontent
        this.reportes[i].show_anteriores_list = !this.reportes[i].show_anteriores_list;

      }
    }
  }

  async addReport(item: any) {
    const alert = await this.alertCtrl.create({
      header: "Nuevo reporte",
      subHeader: "",
      message: "",
      inputs: [
        {
          name: 'comentario', // Agregar un nombre al input
          type: 'textarea',
          placeholder: 'Comentario',
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        }, {
          text: 'Aceptar',
          handler: (data:any) => {
            let report: any = {
              comment: data.comentario,
              id_mechanic_file: item._id
            }
            this.sellerSrv.addRerport(report).subscribe((r: any) => {
              this.getListReport(item)
            });
          }
        }
      ]
    });

    await alert.present();
    // this.reportes.push({
    //   _id:0,
    //   campos_actualizados:{},
    //   campos_anteriores:{},
    //   comment:"",
    //   date:"",
    //   id_mechanic_file:0,
    //   id_user:0,
    //   type:"Normal",
    //   user:null,
    // });
  }
}

