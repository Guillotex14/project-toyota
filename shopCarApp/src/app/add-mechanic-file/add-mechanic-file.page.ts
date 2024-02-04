import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, Platform } from '@ionic/angular';
import { AddMechanicFile } from 'src/models/sellet';
import { MechanicService } from '../services/mechanic/mechanic.service';
import { UtilsService } from '../services/utils/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MechanicalFileModel } from '../../models/mechanic';

@Component({
  selector: 'app-add-mechanic-file',
  templateUrl: './add-mechanic-file.page.html',
  styleUrls: ['./add-mechanic-file.page.scss'],
})
export class AddMechanicFilePage implements OnInit {

  newMechanicalFile: MechanicalFileModel = new MechanicalFileModel();

  android: boolean = false;
  ios: boolean = false;
  web: boolean = false;
  id_vehicle: string = "";
  theRoute: string = "";
  backToTop: boolean = false;
  disabledSave: boolean = false;

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
  
  constructor(private router: Router, private platform: Platform, private actRoute: ActivatedRoute, private mechanicSrv: MechanicService, private utils: UtilsService) { 
    this.id_vehicle = this.actRoute.snapshot.params['id'];
    this.theRoute = this.actRoute.snapshot.params['route'];

    let data = localStorage.getItem('me');

    if (data != null) {
      let me = JSON.parse(data);
      this.newMechanicalFile.id_mechanic = me.id_mechanic;
    }

    this.newMechanicalFile.steering_wheel={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.pedals={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.gauges_dashboard_lights={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.transmission_shift_lever={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.brake_lever={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.accessories={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.internal_upholstery={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.courtesy_lights={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.windshield={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.window_glass_operation={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.door_locks_handles={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.operation_manual_electric_mirrors={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.seat_belts={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.front_bumpers={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.front_grill={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.headlights_low_beams_cocuyos={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.fog_lights={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.bonnet={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.engine_ignition={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.engine_noises={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.general_condition_fluids={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.fluid_reservoirs={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.spark_plugs_coils_general_condition={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.air_filter={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.transmission_belts={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.appearance_hoses_caps_seals_connections={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.battery_condition_terminal_tightness_corrosion={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.fluid_leak={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.general_engine_compression_condition={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.stabilizer_bars={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.bearings={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.joints_dust_covers={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.shock_absorbers={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.spirals={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.upper_lower_plateaus={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.stumps={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.terminal_blocks={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.brakes={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.cardan_transmission_shaft={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.engine_transmission_oil_leaks={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.hydraulic_oil_leak_steering_box={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.excessive_rust_on_frame_compact={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.exhaust_pipe={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.doors={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.stop={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.fuel_pump_door={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.trunk_door={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.trunk_interior={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.replacement_rubber_tool_set={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.complete_emblems={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.bodywork={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.paint={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.tire_condition={
      apply: false,
      no_apply: false,
      upgrade: false
    };
    this.newMechanicalFile.wheel_ornaments={
      apply: false,
      no_apply: false,
      upgrade: false
    };

    this.newMechanicalFile.dealer_maintenance = "";
    this.newMechanicalFile.general_condition = 0;
    this.newMechanicalFile.certificate = false;
    this.newMechanicalFile.id_vehicle = this.id_vehicle;
  }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['/car-detail-mechanic/'+this.id_vehicle+'/'+this.theRoute]);
    this.disabledSave = false;
  }

  public saveMechanicalFile(){

    if (this.onValidateForm() === false){
      return;
    }
    
    this.disabledSave = true;
    this.utils.presentToast("Creando ficha mecánica")
    this.mechanicSrv.addMechanicalFile(this.newMechanicalFile).subscribe((res:any) => {
      if (res.status) {
        this.utils.dismissLoading()
        this.utils.presentToast("Se ha creado la ficha mecánica correctamente")
        this.router.navigate(['mechanic']);
        this.newMechanicalFile.steering_wheel={};
        this.newMechanicalFile.pedals={};
        this.newMechanicalFile.gauges_dashboard_lights={};
        this.newMechanicalFile.transmission_shift_lever={};
        this.newMechanicalFile.brake_lever={};
        this.newMechanicalFile.accessories={};
        this.newMechanicalFile.internal_upholstery={};
        this.newMechanicalFile.courtesy_lights={};
        this.newMechanicalFile.windshield={};
        this.newMechanicalFile.window_glass_operation={};
        this.newMechanicalFile.door_locks_handles={};
        this.newMechanicalFile.operation_manual_electric_mirrors={};
        this.newMechanicalFile.seat_belts={};
        this.newMechanicalFile.front_bumpers={};
        this.newMechanicalFile.front_grill={};
        this.newMechanicalFile.headlights_low_beams_cocuyos={};
        this.newMechanicalFile.fog_lights={};
        this.newMechanicalFile.bonnet={};
        this.newMechanicalFile.engine_ignition={};
        this.newMechanicalFile.engine_noises={};
        this.newMechanicalFile.general_condition_fluids={};
        this.newMechanicalFile.fluid_reservoirs={};
        this.newMechanicalFile.spark_plugs_coils_general_condition={};
        this.newMechanicalFile.air_filter={};
        this.newMechanicalFile.transmission_belts={};
        this.newMechanicalFile.appearance_hoses_caps_seals_connections={};
        this.newMechanicalFile.battery_condition_terminal_tightness_corrosion={};
        this.newMechanicalFile.fluid_leak={};
        this.newMechanicalFile.general_engine_compression_condition={};
        this.newMechanicalFile.stabilizer_bars={};
        this.newMechanicalFile.bearings={};
        this.newMechanicalFile.joints_dust_covers={};
        this.newMechanicalFile.shock_absorbers={};
        this.newMechanicalFile.spirals={};
        this.newMechanicalFile.upper_lower_plateaus={};
        this.newMechanicalFile.stumps={};
        this.newMechanicalFile.terminal_blocks={};
        this.newMechanicalFile.brakes={};
        this.newMechanicalFile.cardan_transmission_shaft={};
        this.newMechanicalFile.engine_transmission_oil_leaks={};
        this.newMechanicalFile.hydraulic_oil_leak_steering_box={};
        this.newMechanicalFile.excessive_rust_on_frame_compact={};
        this.newMechanicalFile.exhaust_pipe={};
        this.newMechanicalFile.doors={};
        this.newMechanicalFile.stop={};
        this.newMechanicalFile.fuel_pump_door={};
        this.newMechanicalFile.trunk_door={};
        this.newMechanicalFile.trunk_interior={};
        this.newMechanicalFile.replacement_rubber_tool_set={};
        this.newMechanicalFile.complete_emblems={};
        this.newMechanicalFile.bodywork={};
        this.newMechanicalFile.paint={};
        this.newMechanicalFile.tire_condition={};
        this.newMechanicalFile.wheel_ornaments={};
        this.newMechanicalFile.general_condition = 0;
        this.newMechanicalFile.dealer_maintenance = "";
      }else{
        this.utils.dismissLoading()
        this.utils.presentToast("Ha ocurrido un error al crear la ficha mecánica")
      }
    }
    ,(err) => {
      this.utils.dismissLoading()
      this.utils.presentToast("Ha ocurrido un error al crear la ficha mecánica")
    }
    )

    
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
  
  public generalCondition(event: any, field: any, name:string, input: string){

    if (event.detail.checked === true) {
    //   //buscamos el campo en los arreglos para saber cual es su valor y sumarlos       
      if (this.dataValueOne.includes(name)) {
        if (field.apply === true && field.upgrade === false && field.no_apply === false) {
          this.newMechanicalFile.general_condition+=1;
        }

        if (field.upgrade === true && field.apply === false && field.no_apply === false) {
          this.newMechanicalFile.general_condition+=1;
        }

        if ( field.no_apply === true && field.apply === false && field.upgrade === false) {
          this.newMechanicalFile.general_condition+=0;
        }
        
        if ( field.no_apply === true && field.apply === true && field.upgrade === false) {
          if (this.newMechanicalFile.general_condition > 0) {
            
            this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 1;
          }
        }

        if ( field.no_apply === true && field.apply === false && field.upgrade === true) {
          if (this.newMechanicalFile.general_condition > 0) {
            
            this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 1;
          }
        }

        if ( field.no_apply === true && field.apply === true && field.upgrade === true) {
          if (this.newMechanicalFile.general_condition > 0) {
            
            this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 1;
          }
        }

      }

      if (this.dataValueTwo.includes(name)) {
        
        if (field.apply === true && field.upgrade === false && field.no_apply === false) {
          this.newMechanicalFile.general_condition+=2;
        }

        if (field.upgrade === true && field.apply === false && field.no_apply === false) {
          this.newMechanicalFile.general_condition+=2;
        }

        if ( field.no_apply === true && field.apply === false && field.upgrade === false) {
          this.newMechanicalFile.general_condition+=0;
        }

        console.log(this.newMechanicalFile.general_condition)
        if ( field.no_apply === true && field.apply === true && field.upgrade === false) {
          if (this.newMechanicalFile.general_condition > 0) {
            this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 2;
          }
        }

        if ( field.no_apply === true && field.apply === false && field.upgrade === true) {
          if (this.newMechanicalFile.general_condition > 0) {
            this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 2;
          }
        }

        if ( field.no_apply === true && field.apply === true && field.upgrade === true) {
          if (this.newMechanicalFile.general_condition > 0) {
            this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 2;
          }
        }

      }

      if (this.dataValueThree.includes(name)) {
        
        if (field.apply === true && field.upgrade === false && field.no_apply === false) {
          this.newMechanicalFile.general_condition+=3;
        }

        if (field.upgrade === true && field.apply === false && field.no_apply === false) {
          this.newMechanicalFile.general_condition+=3;
        }

        if ( field.no_apply === true && field.apply === false && field.upgrade === false) {
          this.newMechanicalFile.general_condition+=0;
        }

        if ( field.no_apply === true && field.apply === true && field.upgrade === false) {
          if (this.newMechanicalFile.general_condition > 0) {
            this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 3;
          }
        }

        if ( field.no_apply === true && field.apply === false && field.upgrade === true) {
          if (this.newMechanicalFile.general_condition > 0) {
            this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 3;
          }
        }

        if ( field.no_apply === true && field.apply === true && field.upgrade === true) {
          if (this.newMechanicalFile.general_condition > 0) {
            this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 3;
          }
        }

      }

      if (this.dataValueSix.includes(name)) {
        
        if (field.apply === true && field.upgrade === false && field.no_apply === false) {
          this.newMechanicalFile.general_condition+=6;
        }

        if (field.upgrade === true && field.apply === false && field.no_apply === false) {
          this.newMechanicalFile.general_condition+=6;
        }

        if ( field.no_apply === true && field.apply === false && field.upgrade === false) {
          this.newMechanicalFile.general_condition+=0;
        }

        if ( field.no_apply === true && field.apply === true && field.upgrade === false) {
          if (this.newMechanicalFile.general_condition > 0) {
            this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 6;
          }
        }

        if ( field.no_apply === true && field.apply === false && field.upgrade === true) {
          if (this.newMechanicalFile.general_condition > 0) {
            this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 6;
          }
        }

        if ( field.no_apply === true && field.apply === true && field.upgrade === true) {
          if (this.newMechanicalFile.general_condition > 0) {
            this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 6;
          }
        }
      }
    }

    if (event.detail.checked === false) {
      //buscamos el campo en los arreglos para saber cual es su valor y restarlos      
      if (this.dataValueOne.includes(name)) {
        if (field.apply === false && field.upgrade === false && input !== 'no_apply' ) {
          if (this.newMechanicalFile.general_condition > 0) {
            this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 1;
          }
        }

      }

      if (this.dataValueTwo.includes(name)) {
        
        if (field.apply === false && field.upgrade === false  && input !== 'no_apply' ) {
          if (this.newMechanicalFile.general_condition > 0) {
            this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 2;
          }
        }
      }

      if (this.dataValueThree.includes(name)) {
        
        if (field.apply === false && field.upgrade === false  && input !== 'no_apply' ) {
          if (this.newMechanicalFile.general_condition > 0) {
            this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 3;
          }
        }
      }

      if (this.dataValueSix.includes(name)) {
        
        if (field.apply === false && field.upgrade === false  && input !== 'no_apply' ) {
          if (this.newMechanicalFile.general_condition > 0) {
            this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 6;
          }
        }

        if (field.upgrade === false && field.apply === false  && input !== 'no_apply' ) {
          
          if (this.newMechanicalFile.general_condition > 0) {
            this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 6;
          }
          
        }
      }
    }
    
    console.log(this.newMechanicalFile.general_condition)
  }

  public onCheckNoApply(event: any, field: any, name:string){
    if(event.detail.checked == true){
      field.apply = false;
      field.no_apply = true;
      field.upgrade = false;

      if (this.dataValueOne.includes(name)) {
        if (this.newMechanicalFile.general_condition > 0) {
          this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 1;
          
        }
      }

      if (this.dataValueTwo.includes(name)) {
        if (this.newMechanicalFile.general_condition > 0) {
          this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 2;
        }
      }

      if (this.dataValueThree.includes(name)) {
        
        if (this.newMechanicalFile.general_condition > 0) {
          this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 3;
        }
      }

      if (this.dataValueSix.includes(name)) {
        
        if (this.newMechanicalFile.general_condition > 0) {
          this.newMechanicalFile.general_condition = this.newMechanicalFile.general_condition - 6;
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

    if(this.newMechanicalFile.steering_wheel === undefined || this.newMechanicalFile.steering_wheel === null || this.newMechanicalFile.steering_wheel.apply === false && this.newMechanicalFile.steering_wheel.no_apply === false && this.newMechanicalFile.steering_wheel.upgrade === false){
      this.utils.presentToast("El campo Volante es requerido");
      return false;
    }

    if(this.newMechanicalFile.pedals === undefined || this.newMechanicalFile.pedals === null || this.newMechanicalFile.pedals.apply === false && this.newMechanicalFile.pedals.no_apply === false && this.newMechanicalFile.pedals.upgrade === false){
      this.utils.presentToast("El campo Pedales es requerido");
      return false;
    }

    if(this.newMechanicalFile.gauges_dashboard_lights === undefined || this.newMechanicalFile.gauges_dashboard_lights === null || this.newMechanicalFile.gauges_dashboard_lights.apply === false && this.newMechanicalFile.gauges_dashboard_lights.no_apply === false && this.newMechanicalFile.gauges_dashboard_lights.upgrade === false){
      this.utils.presentToast("El campo Medidores y luces del tablero es requerido");
      return false;
    }

    if(this.newMechanicalFile.transmission_shift_lever === undefined || this.newMechanicalFile.transmission_shift_lever === null || this.newMechanicalFile.transmission_shift_lever.apply === false && this.newMechanicalFile.transmission_shift_lever.no_apply === false && this.newMechanicalFile.transmission_shift_lever.upgrade === false){
      this.utils.presentToast("El campo Palanca de cambio de transmisión es requerido");
      return false;
    }

    if(this.newMechanicalFile.brake_lever === undefined || this.newMechanicalFile.brake_lever === null || this.newMechanicalFile.brake_lever.apply === false && this.newMechanicalFile.brake_lever.no_apply === false && this.newMechanicalFile.brake_lever.upgrade === false){
      this.utils.presentToast("El campo Palanca de freno es requerido");
      return false;
    }

    if(this.newMechanicalFile.accessories === undefined || this.newMechanicalFile.accessories === null || this.newMechanicalFile.accessories.apply === false && this.newMechanicalFile.accessories.no_apply === false && this.newMechanicalFile.accessories.upgrade === false){
      this.utils.presentToast("El campo Accesorios es requerido");
      return false;
    }


    if(this.newMechanicalFile.internal_upholstery === undefined || this.newMechanicalFile.internal_upholstery === null || this.newMechanicalFile.internal_upholstery.apply === false && this.newMechanicalFile.internal_upholstery.no_apply === false && this.newMechanicalFile.internal_upholstery.upgrade === false){
      this.utils.presentToast("El campo Tapicería interna es requerido");
      return false;
    }

    if(this.newMechanicalFile.courtesy_lights === undefined || this.newMechanicalFile.courtesy_lights === null || this.newMechanicalFile.courtesy_lights.apply === false && this.newMechanicalFile.courtesy_lights.no_apply === false && this.newMechanicalFile.courtesy_lights.upgrade === false){
      this.utils.presentToast("El campo BLuces de cortesía es requerido");
      return false;
    }

    if(this.newMechanicalFile.windshield === undefined || this.newMechanicalFile.windshield === null || this.newMechanicalFile.windshield.apply === false && this.newMechanicalFile.windshield.no_apply === false && this.newMechanicalFile.windshield.upgrade === false){
      this.utils.presentToast("El campo Parabrisas es requerido");
      return false;
    }

    if(this.newMechanicalFile.window_glass_operation === undefined || this.newMechanicalFile.window_glass_operation === null || this.newMechanicalFile.window_glass_operation.apply === false && this.newMechanicalFile.window_glass_operation.no_apply === false && this.newMechanicalFile.window_glass_operation.upgrade === false){
      this.utils.presentToast("El campo Funcionamiento de vidrios de ventana es requerido")
      return false;
    }

    if(this.newMechanicalFile.door_locks_handles === undefined || this.newMechanicalFile.door_locks_handles === null || this.newMechanicalFile.door_locks_handles.apply === false && this.newMechanicalFile.door_locks_handles.no_apply === false && this.newMechanicalFile.door_locks_handles.upgrade === false){
      this.utils.presentToast("El campo Seguros y manillas de puerta es requerido")
      return false;
    }

    if(this.newMechanicalFile.operation_manual_electric_mirrors === undefined || this.newMechanicalFile.operation_manual_electric_mirrors === null || this.newMechanicalFile.operation_manual_electric_mirrors.apply === false && this.newMechanicalFile.operation_manual_electric_mirrors.no_apply === false && this.newMechanicalFile.operation_manual_electric_mirrors.upgrade === false){
      this.utils.presentToast("El campo Operación de Retrovisores manuales o eléctricos es requerido")
      return false;
    }


    if(this.newMechanicalFile.seat_belts === undefined || this.newMechanicalFile.seat_belts === null || this.newMechanicalFile.seat_belts.apply === false && this.newMechanicalFile.seat_belts.no_apply === false && this.newMechanicalFile.seat_belts.upgrade === false){
      this.utils.presentToast("El campo Cinturones de Seguridad es requerido")
      return false;
    }

    if(this.newMechanicalFile.front_bumpers === undefined || this.newMechanicalFile.front_bumpers === null || this.newMechanicalFile.front_bumpers.apply === false && this.newMechanicalFile.front_bumpers.no_apply === false && this.newMechanicalFile.front_bumpers.upgrade === false){
      this.utils.presentToast("El campo Parachoques delanteros es requerido")
      return false;
    }

    if(this.newMechanicalFile.front_grill === undefined || this.newMechanicalFile.front_grill === null || this.newMechanicalFile.front_grill.apply === false && this.newMechanicalFile.front_grill.no_apply === false && this.newMechanicalFile.front_grill.upgrade === false){
      this.utils.presentToast("El campo Parrilla frontal es requerido")
      return false;
    }

    if(this.newMechanicalFile.headlights_low_beams_cocuyos === undefined || this.newMechanicalFile.headlights_low_beams_cocuyos === null || this.newMechanicalFile.headlights_low_beams_cocuyos.apply === false && this.newMechanicalFile.headlights_low_beams_cocuyos.no_apply === false && this.newMechanicalFile.headlights_low_beams_cocuyos.upgrade === false){
      this.utils.presentToast("El campo Faros, luces de cruce y cocuyos es requerido")
      return false;
    }

    if(this.newMechanicalFile.fog_lights === undefined || this.newMechanicalFile.fog_lights === null || this.newMechanicalFile.fog_lights.apply === false && this.newMechanicalFile.fog_lights.no_apply === false && this.newMechanicalFile.fog_lights.upgrade === false){
      this.utils.presentToast("El campo Faros antinieblas es requerido")
      return false;
    }

    if(this.newMechanicalFile.bonnet === undefined || this.newMechanicalFile.bonnet === null || this.newMechanicalFile.bonnet.apply === false && this.newMechanicalFile.bonnet.no_apply === false && this.newMechanicalFile.bonnet.upgrade === false){
      this.utils.presentToast("El campo Capot es requerido")
      return false;
    }

    if(this.newMechanicalFile.engine_ignition === undefined || this.newMechanicalFile.engine_ignition === null || this.newMechanicalFile.engine_ignition.apply === false && this.newMechanicalFile.engine_ignition.no_apply === false && this.newMechanicalFile.engine_ignition.upgrade === false){
      this.utils.presentToast("El campo Encendido del motor es requerido")
      return false;
    }

    if(this.newMechanicalFile.engine_noises === undefined || this.newMechanicalFile.engine_noises === null || this.newMechanicalFile.engine_noises.apply === false && this.newMechanicalFile.engine_noises.no_apply === false && this.newMechanicalFile.engine_noises.upgrade === false){
      this.utils.presentToast("El campo Ruidos de motor es requerido")
      return false;
    }

    if(this.newMechanicalFile.general_condition_fluids === undefined || this.newMechanicalFile.general_condition_fluids === null || this.newMechanicalFile.general_condition_fluids.apply === false && this.newMechanicalFile.general_condition_fluids.no_apply === false && this.newMechanicalFile.general_condition_fluids.upgrade === false){
      this.utils.presentToast("El campo Fluidos estado general es requerido")
      return false;
    }

    if(this.newMechanicalFile.fluid_reservoirs === undefined || this.newMechanicalFile.fluid_reservoirs === null || this.newMechanicalFile.fluid_reservoirs.apply === false && this.newMechanicalFile.fluid_reservoirs.no_apply === false && this.newMechanicalFile.fluid_reservoirs.upgrade === false){
      this.utils.presentToast("El campo Depósitos de fluidos es requerido")
      return false;
    }

    if(this.newMechanicalFile.spark_plugs_coils_general_condition === undefined || this.newMechanicalFile.spark_plugs_coils_general_condition === null || this.newMechanicalFile.spark_plugs_coils_general_condition.apply === false && this.newMechanicalFile.spark_plugs_coils_general_condition.no_apply === false && this.newMechanicalFile.spark_plugs_coils_general_condition.upgrade === false){
      this.utils.presentToast("El campo Bujías y bobinas condición general es requerido")
      return false;
    }

    if(this.newMechanicalFile.air_filter === undefined || this.newMechanicalFile.air_filter === null || this.newMechanicalFile.air_filter.apply === false && this.newMechanicalFile.air_filter.no_apply === false && this.newMechanicalFile.air_filter.upgrade === false){
      this.utils.presentToast("El campo Filtro de aire es requerido")
      return false;
    }

    if(this.newMechanicalFile.transmission_belts === undefined || this.newMechanicalFile.transmission_belts === null || this.newMechanicalFile.transmission_belts.apply === false && this.newMechanicalFile.transmission_belts.no_apply === false && this.newMechanicalFile.transmission_belts.upgrade === false){
      this.utils.presentToast("El campo Correas de transmisión es requerido")
      return false;
    }

    if(this.newMechanicalFile.appearance_hoses_caps_seals_connections === undefined || this.newMechanicalFile.appearance_hoses_caps_seals_connections === null || this.newMechanicalFile.appearance_hoses_caps_seals_connections.apply === false && this.newMechanicalFile.appearance_hoses_caps_seals_connections.no_apply === false && this.newMechanicalFile.appearance_hoses_caps_seals_connections.upgrade === false){
      this.utils.presentToast("El campo apariencia Mangueras, tapas, sellos y conexiones es requerido")
      return false;
    }

    if(this.newMechanicalFile.battery_condition_terminal_tightness_corrosion === undefined || this.newMechanicalFile.battery_condition_terminal_tightness_corrosion === null || this.newMechanicalFile.battery_condition_terminal_tightness_corrosion.apply === false && this.newMechanicalFile.battery_condition_terminal_tightness_corrosion.no_apply === false && this.newMechanicalFile.battery_condition_terminal_tightness_corrosion.upgrade === false){
      this.utils.presentToast("El campo Estado de la batería es requerido")
      return false;
    }

    if(this.newMechanicalFile.fluid_leak === undefined || this.newMechanicalFile.fluid_leak === null || this.newMechanicalFile.fluid_leak.apply === false && this.newMechanicalFile.fluid_leak.no_apply === false && this.newMechanicalFile.fluid_leak.upgrade === false){
      this.utils.presentToast("El campo Fuga de fluidos es requerido")
      return false;
    }

    if(this.newMechanicalFile.id_mechanic === undefined || this.newMechanicalFile.id_mechanic === null || this.newMechanicalFile.id_mechanic === ""){
      this.utils.presentToast("El campo id del Técnico es requerido")
      return false;
    }
    
    if(this.newMechanicalFile.id_vehicle === undefined || this.newMechanicalFile.id_vehicle === null || this.newMechanicalFile.id_vehicle === ""){

      this.utils.presentToast("El campo id del vehículo es requerido")
      return false;
    }

    if(this.newMechanicalFile.general_engine_compression_condition === undefined || this.newMechanicalFile.general_engine_compression_condition === null || this.newMechanicalFile.general_engine_compression_condition === "" || this.newMechanicalFile.general_engine_compression_condition === 0){

      this.utils.presentToast("El campo Condición general de la compresión del motor es requerido")
      return false;
    }

    if(this.newMechanicalFile.stabilizer_bars === undefined || this.newMechanicalFile.stabilizer_bars === null || this.newMechanicalFile.stabilizer_bars.apply === false && this.newMechanicalFile.stabilizer_bars.no_apply === false && this.newMechanicalFile.stabilizer_bars.upgrade === false){

      this.utils.presentToast("El campo Barras estabilizadoras es requerido")
      return false;
    }

    if(this.newMechanicalFile.bearings === undefined || this.newMechanicalFile.bearings === null || this.newMechanicalFile.bearings.apply === false && this.newMechanicalFile.bearings.no_apply === false && this.newMechanicalFile.bearings.upgrade === false){

      this.utils.presentToast("El campo Rodamientos es requerido")
      return false;
    }

    if(this.newMechanicalFile.joints_dust_covers === undefined || this.newMechanicalFile.joints_dust_covers === null || this.newMechanicalFile.joints_dust_covers.apply === false && this.newMechanicalFile.joints_dust_covers.no_apply === false && this.newMechanicalFile.joints_dust_covers.upgrade === false){

      this.utils.presentToast("El campo Juntas homocinéticas y guardapolvos es requerido")
      return false;
    }

    if(this.newMechanicalFile.shock_absorbers === undefined || this.newMechanicalFile.shock_absorbers === null || this.newMechanicalFile.shock_absorbers.apply === false && this.newMechanicalFile.shock_absorbers.no_apply === false && this.newMechanicalFile.shock_absorbers.upgrade === false){

      this.utils.presentToast("El campo Amortiguadores es requerido")
      return false;
    }

    if(this.newMechanicalFile.spirals === undefined || this.newMechanicalFile.spirals === null || this.newMechanicalFile.spirals.apply === false && this.newMechanicalFile.spirals.no_apply === false && this.newMechanicalFile.spirals.upgrade === false){

      this.utils.presentToast("El campo Espirales es requerido")
      return false;
    }

    if(this.newMechanicalFile.upper_lower_plateaus === undefined || this.newMechanicalFile.upper_lower_plateaus === null || this.newMechanicalFile.upper_lower_plateaus.apply === false && this.newMechanicalFile.upper_lower_plateaus.no_apply === false && this.newMechanicalFile.upper_lower_plateaus.upgrade === false){

      this.utils.presentToast("El campo Mesetas sup.e inf. es requerido")
      return false;
    }

    if(this.newMechanicalFile.stumps === undefined || this.newMechanicalFile.stumps === null || this.newMechanicalFile.stumps.apply === false && this.newMechanicalFile.stumps.no_apply === false && this.newMechanicalFile.stumps.upgrade === false){

      this.utils.presentToast("El campo Muñones es requerido")
      return false;
    }

    if(this.newMechanicalFile.terminal_blocks === undefined || this.newMechanicalFile.terminal_blocks === null || this.newMechanicalFile.terminal_blocks.apply === false && this.newMechanicalFile.terminal_blocks.no_apply === false && this.newMechanicalFile.terminal_blocks.upgrade === false){

      this.utils.presentToast("El campo Terminales de dirección es requerido")
      return false;
    }

    if(this.newMechanicalFile.brakes === undefined || this.newMechanicalFile.brakes === null || this.newMechanicalFile.brakes.apply === false && this.newMechanicalFile.brakes.no_apply === false && this.newMechanicalFile.brakes.upgrade === false){

      this.utils.presentToast("El campo Frenos es requerido")
      return false;
    }

    if(this.newMechanicalFile.cardan_transmission_shaft === undefined || this.newMechanicalFile.cardan_transmission_shaft === null || this.newMechanicalFile.cardan_transmission_shaft.apply === false && this.newMechanicalFile.cardan_transmission_shaft.no_apply === false && this.newMechanicalFile.cardan_transmission_shaft.upgrade === false){

      this.utils.presentToast("El campo Cardan o Eje de Transmisión es requerido")
      return false;
    }

    if(this.newMechanicalFile.engine_transmission_oil_leaks === undefined || this.newMechanicalFile.engine_transmission_oil_leaks === undefined || this.newMechanicalFile.engine_transmission_oil_leaks.apply === false && this.newMechanicalFile.engine_transmission_oil_leaks.no_apply === false && this.newMechanicalFile.engine_transmission_oil_leaks.updagrade === false){

      this.utils.presentToast("El campo Fugas de aceite de motor/transmisión es requerido")
      return false;
    }

    if(this.newMechanicalFile.hydraulic_oil_leak_steering_box === undefined || this.newMechanicalFile.hydraulic_oil_leak_steering_box === null || this.newMechanicalFile.hydraulic_oil_leak_steering_box.apply === false && this.newMechanicalFile.hydraulic_oil_leak_steering_box.no_apply === false && this.newMechanicalFile.hydraulic_oil_leak_steering_box.upgrade === false){

      this.utils.presentToast("El campo Fuga de aceite hidráulico  en cajetín de dirección es requerido")
      return false;
    }

    if(this.newMechanicalFile.excessive_rust_on_frame_compact === undefined || this.newMechanicalFile.excessive_rust_on_frame_compact === null || this.newMechanicalFile.excessive_rust_on_frame_compact.apply === false && this.newMechanicalFile.excessive_rust_on_frame_compact.no_apply === false && this.newMechanicalFile.excessive_rust_on_frame_compact.upgrade === false){

      this.utils.presentToast("El campo Oxido excesivo en el bastidor o compacto es requerido")
      return false;
    }

    if(this.newMechanicalFile.exhaust_pipe === undefined || this.newMechanicalFile.exhaust_pipe === null || this.newMechanicalFile.exhaust_pipe.apply === false && this.newMechanicalFile.exhaust_pipe.no_apply === false && this.newMechanicalFile.exhaust_pipe.upgrade === false){

      this.utils.presentToast("El campo Tubo de escape es requerido")
      return false;
    }

    if(this.newMechanicalFile.doors === undefined || this.newMechanicalFile.doors === null || this.newMechanicalFile.doors.apply === false && this.newMechanicalFile.doors.no_apply === false && this.newMechanicalFile.doors.upgrade === false){

      this.utils.presentToast("El campo Puertas es requerido")
      return false;
    }

    if(this.newMechanicalFile.stop === undefined || this.newMechanicalFile.stop === null || this.newMechanicalFile.stop.apply === false && this.newMechanicalFile.stop.no_apply === false && this.newMechanicalFile.stop.upgrade === false){

      this.utils.presentToast("El campo Stop es requerido")
      return false;
    }

    if(this.newMechanicalFile.fuel_pump_door === undefined || this.newMechanicalFile.fuel_pump_door === null || this.newMechanicalFile.fuel_pump_door.apply === false && this.newMechanicalFile.fuel_pump_door.no_apply === false && this.newMechanicalFile.fuel_pump_door.upgrade === false){

      this.utils.presentToast("El campo Compuerta del surtidor de combustible es requerido")
      return false;
    }

    if(this.newMechanicalFile.trunk_door === undefined || this.newMechanicalFile.trunk_door === null || this.newMechanicalFile.trunk_door.apply === false && this.newMechanicalFile.trunk_door.no_apply === false && this.newMechanicalFile.trunk_door.upgrade === false){

      this.utils.presentToast("El campo Puerta del Maletero es requerido")
      return false;
    }

    if(this.newMechanicalFile.trunk_interior === undefined || this.newMechanicalFile.trunk_interior === null || this.newMechanicalFile.trunk_interior.apply === false && this.newMechanicalFile.trunk_interior.no_apply === false && this.newMechanicalFile.trunk_interior.upgrade === false){

      this.utils.presentToast("El campo Interior del Maletero es requerido")
      return false;
    }

    if(this.newMechanicalFile.replacement_rubber_tool_set === undefined || this.newMechanicalFile.replacement_rubber_tool_set === null || this.newMechanicalFile.replacement_rubber_tool_set.apply === false && this.newMechanicalFile.replacement_rubber_tool_set.no_apply === false && this.newMechanicalFile.replacement_rubber_tool_set.upgrade === false){

      this.utils.presentToast("El campo Caucho de repuesto y Juego de Herramientas es requerido")
      return false;
    }

    if(this.newMechanicalFile.complete_emblems === undefined || this.newMechanicalFile.complete_emblems === null || this.newMechanicalFile.complete_emblems.apply === false && this.newMechanicalFile.complete_emblems.no_apply === false && this.newMechanicalFile.complete_emblems.upgrade === false){

      this.utils.presentToast("El campo Emblemas completos es requerido")
      return false;
    }

    if(this.newMechanicalFile.bodywork === undefined || this.newMechanicalFile.bodywork === null || this.newMechanicalFile.bodywork.apply === false && this.newMechanicalFile.bodywork.no_apply === false && this.newMechanicalFile.bodywork.upgrade === false){

      this.utils.presentToast("El campo Carrocería es requerido")
      return false;
    }

    if(this.newMechanicalFile.paint === undefined || this.newMechanicalFile.paint === null || this.newMechanicalFile.paint.apply === false && this.newMechanicalFile.paint.no_apply === false && this.newMechanicalFile.paint.upgrade === false){

      this.utils.presentToast("El campo Pintura es requerido")
      return false;
    }

    if(this.newMechanicalFile.tire_condition === undefined || this.newMechanicalFile.tire_condition === null || this.newMechanicalFile.tire_condition.apply === false && this.newMechanicalFile.tire_condition.no_apply === false && this.newMechanicalFile.tire_condition.upgrade === false){

      this.utils.presentToast("El campo Estado de los neumáticos es requerido")
      return false;
    }

    if(this.newMechanicalFile.wheel_ornaments === undefined || this.newMechanicalFile.wheel_ornaments === null || this.newMechanicalFile.wheel_ornaments.apply === false && this.newMechanicalFile.wheel_ornaments.no_apply === false && this.newMechanicalFile.wheel_ornaments.upgrade === false){

      this.utils.presentToast("El campo Ornamentos de ruedas es requerido")
      return false;
    }

    // if(this.newMechanicalFile.dealer_maintenance === undefined || this.newMechanicalFile.dealer_maintenance === null || this.newMechanicalFile.dealer_maintenance === ""){
    //   this.utils.presentToast("El campo Mantenimiento en concesionario es requerido");
    //   return false;
    // }

    return true;
  }
}
