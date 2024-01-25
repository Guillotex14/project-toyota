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
  @ViewChild(IonContent) content!: IonContent;
  
  constructor(private router: Router, private platform: Platform, private actRoute: ActivatedRoute, private mechanicSrv: MechanicService, private utils: UtilsService) { 
    this.id_vehicle = this.actRoute.snapshot.params['id'];
    this.theRoute = this.actRoute.snapshot.params['route'];

    let data = localStorage.getItem('me');

    if (data != null) {
      let me = JSON.parse(data);
      this.newMechanicalFile.id_mechanic = me.id_mechanic;
    }

    this.newMechanicalFile.steering_wheel="";
    this.newMechanicalFile.pedals="";
    this.newMechanicalFile.gauges_dashboard_lights="";
    this.newMechanicalFile.transmission_shift_lever="";
    this.newMechanicalFile.brake_lever="";
    this.newMechanicalFile.accessories="";
    this.newMechanicalFile.internal_upholstery="";
    this.newMechanicalFile.courtesy_lights="";
    this.newMechanicalFile.windshield="";
    this.newMechanicalFile.window_glass_operation="";
    this.newMechanicalFile.door_locks_handles="";
    this.newMechanicalFile.operation_manual_electric_mirrors="";
    this.newMechanicalFile.seat_belts="";
    this.newMechanicalFile.front_bumpers="";
    this.newMechanicalFile.front_grill="";
    this.newMechanicalFile.headlights_low_beams_cocuyos="";
    this.newMechanicalFile.fog_lights="";
    this.newMechanicalFile.bonnet="";
    this.newMechanicalFile.engine_ignition="";
    this.newMechanicalFile.engine_noises="";
    this.newMechanicalFile.general_condition_fluids="";
    this.newMechanicalFile.fluid_reservoirs="";
    this.newMechanicalFile.spark_plugs_coils_general_condition="";
    this.newMechanicalFile.air_filter="";
    this.newMechanicalFile.transmission_belts="";
    this.newMechanicalFile.appearance_hoses_caps_seals_connections="";
    this.newMechanicalFile.battery_condition_terminal_tightness_corrosion="";
    this.newMechanicalFile.fluid_leak="";
    this.newMechanicalFile.general_engine_compression_condition="";
    this.newMechanicalFile.stabilizer_bars="";
    this.newMechanicalFile.bearings="";
    this.newMechanicalFile.joints_dust_covers="";
    this.newMechanicalFile.shock_absorbers="";
    this.newMechanicalFile.spirals="";
    this.newMechanicalFile.upper_lower_plateaus="";
    this.newMechanicalFile.stumps="";
    this.newMechanicalFile.terminal_blocks="";
    this.newMechanicalFile.brakes="";
    this.newMechanicalFile.cardan_transmission_shaft="";
    this.newMechanicalFile.engine_transmission_oil_leaks="";
    this.newMechanicalFile.hydraulic_oil_leak_steering_box="";
    this.newMechanicalFile.excessive_rust_on_frame_compact="";
    this.newMechanicalFile.exhaust_pipe="";
    this.newMechanicalFile.doors="";
    this.newMechanicalFile.stop="";
    this.newMechanicalFile.fuel_pump_door="";
    this.newMechanicalFile.trunk_door="";
    this.newMechanicalFile.trunk_interior="";
    this.newMechanicalFile.replacement_rubber_tool_set="";
    this.newMechanicalFile.complete_emblems="";
    this.newMechanicalFile.bodywork="";
    this.newMechanicalFile.paint="";
    this.newMechanicalFile.tire_condition="";
    this.newMechanicalFile.wheel_ornaments="";
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

    if(this.newMechanicalFile.steering_wheel === "" || this.newMechanicalFile.steering_wheel === undefined){
      this.utils.presentToast("El campo Volante es requerido");
      return;
    }

    if(this.newMechanicalFile.pedals === "" || this.newMechanicalFile.pedals === undefined){
      this.utils.presentToast("El campo Pedales es requerido");
      return;
    }

    if(this.newMechanicalFile.gauges_dashboard_lights === "" || this.newMechanicalFile.gauges_dashboard_lights === undefined){
      this.utils.presentToast("El campo Medidores y luces del tablero es requerido");
      return;
    }

    if(this.newMechanicalFile.transmission_shift_lever === "" || this.newMechanicalFile.transmission_shift_lever === undefined){
      this.utils.presentToast("El campo Palanca de cambio de transmisión es requerido");
      return;
    }

    if(this.newMechanicalFile.brake_lever === "" || this.newMechanicalFile.brake_lever === undefined){
      this.utils.presentToast("El campo Palanca de freno es requerido");
      return;
    }

    if(this.newMechanicalFile.accessories === "" || this.newMechanicalFile.accessories === undefined){
      this.utils.presentToast("El campo Accesorios es requerido");
      return;
    }


    if(this.newMechanicalFile.internal_upholstery === "" || this.newMechanicalFile.internal_upholstery === undefined){
      this.utils.presentToast("El campo Tapicería interna es requerido");
      return;
    }

    if(this.newMechanicalFile.courtesy_lights === "" || this.newMechanicalFile.courtesy_lights === undefined){
      this.utils.presentToast("El campo BLuces de cortesía es requerido");
      return;
    }

    if(this.newMechanicalFile.windshield === "" || this.newMechanicalFile.windshield === undefined){
      this.utils.presentToast("El campo Parabrisas es requerido");
      return;
    }

    if(this.newMechanicalFile.window_glass_operation === "" || this.newMechanicalFile.window_glass_operation === undefined){
      this.utils.presentToast("El campo Funcionamiento de vidrios de ventana es requerido")
      return;
    }

    if(this.newMechanicalFile.door_locks_handles === "" || this.newMechanicalFile.door_locks_handles === undefined){
      this.utils.presentToast("El campo Seguros y manillas de puerta es requerido")
      return;
    }

    if(this.newMechanicalFile.operation_manual_electric_mirrors === "" || this.newMechanicalFile.operation_manual_electric_mirrors === undefined){
      this.utils.presentToast("El campo Operación de Retrovisores manuales o eléctricos es requerido")
      return;
    }


    if(this.newMechanicalFile.seat_belts === "" || this.newMechanicalFile.seat_belts === undefined){
      this.utils.presentToast("El campo Cinturones de Seguridad es requerido")
      return;
    }

    if(this.newMechanicalFile.front_bumpers === "" || this.newMechanicalFile.front_bumpers === undefined){
      this.utils.presentToast("El campo Parachoques delanteros es requerido")
      return;
    }

    if(this.newMechanicalFile.front_grill === "" || this.newMechanicalFile.front_grill === undefined){
      this.utils.presentToast("El campo Parrilla frontal es requerido")
      return;
    }

    if(this.newMechanicalFile.headlights_low_beams_cocuyos === "" || this.newMechanicalFile.headlights_low_beams_cocuyos === undefined){
      this.utils.presentToast("El campo Faros, luces de cruce y cocuyos es requerido")
      return;
    }

    if(this.newMechanicalFile.fog_lights === "" || this.newMechanicalFile.fog_lights === undefined){
      this.utils.presentToast("El campo Faros antinieblas es requerido")
      return;
    }

    if(this.newMechanicalFile.bonnet === "" || this.newMechanicalFile.bonnet === undefined){
      this.utils.presentToast("El campo Capot es requerido")
      return;
    }

    if(this.newMechanicalFile.engine_ignition === "" || this.newMechanicalFile.engine_ignition === undefined){
      this.utils.presentToast("El campo Encendido del motor es requerido")
      return;
    }

    if(this.newMechanicalFile.engine_noises === "" || this.newMechanicalFile.engine_noises === undefined){
      this.utils.presentToast("El campo Ruidos de motor es requerido")
      return;
    }

    if(this.newMechanicalFile.general_condition_fluids === "" || this.newMechanicalFile.general_condition_fluids === undefined){
      this.utils.presentToast("El campo Fluidos estado general es requerido")
      return;
    }

    if(this.newMechanicalFile.fluid_reservoirs === "" || this.newMechanicalFile.fluid_reservoirs === undefined){
      this.utils.presentToast("El campo Depósitos de fluidos es requerido")
      return;
    }

    if(this.newMechanicalFile.spark_plugs_coils_general_condition === "" || this.newMechanicalFile.spark_plugs_coils_general_condition === undefined){
      this.utils.presentToast("El campo Bujías y bobinas condición general es requerido")
      return;
    }

    if(this.newMechanicalFile.air_filter === "" || this.newMechanicalFile.air_filter === undefined){
      this.utils.presentToast("El campo Filtro de aire es requerido")
      return;
    }

    if(this.newMechanicalFile.transmission_belts === "" || this.newMechanicalFile.transmission_belts === undefined){
      this.utils.presentToast("El campo Correas de transmisión es requerido")
      return;
    }

    if(this.newMechanicalFile.appearance_hoses_caps_seals_connections === "" || this.newMechanicalFile.appearance_hoses_caps_seals_connections === undefined){
      this.utils.presentToast("El campo apariencia Mangueras, tapas, sellos y conexiones es requerido")
      return;
    }

    if(this.newMechanicalFile.battery_condition_terminal_tightness_corrosion === "" || this.newMechanicalFile.battery_condition_terminal_tightness_corrosion === undefined){
      this.utils.presentToast("El campo Estado de la batería es requerido")
      return;
    }

    if(this.newMechanicalFile.fluid_leak === "" || this.newMechanicalFile.fluid_leak === undefined){
      this.utils.presentToast("El campo Fuga de fluidos es requerido")
      return;
    }

    if(this.newMechanicalFile.id_mechanic === "" || this.newMechanicalFile.id_mechanic === undefined){
      this.utils.presentToast("El campo id del Técnico es requerido")
      return;
    }
    
    if(this.newMechanicalFile.id_vehicle === "" || this.newMechanicalFile.id_vehicle === undefined){

      this.utils.presentToast("El campo id del vehículo es requerido")
      return;
    }

    if(this.newMechanicalFile.general_engine_compression_condition === "" || this.newMechanicalFile.general_engine_compression_condition === undefined){

      this.utils.presentToast("El campo Condición general de la compresión del motor es requerido")
      return;
    }

    if(this.newMechanicalFile.stabilizer_bars === "" || this.newMechanicalFile.stabilizer_bars === undefined){

      this.utils.presentToast("El campo Barras estabilizadoras es requerido")
      return;
    }

    if(this.newMechanicalFile.bearings === "" || this.newMechanicalFile.bearings === undefined){

      this.utils.presentToast("El campo Rodamientos es requerido")
      return;
    }

    if(this.newMechanicalFile.joints_dust_covers === "" || this.newMechanicalFile.joints_dust_covers === undefined){

      this.utils.presentToast("El campo Juntas homocinéticas y guardapolvos es requerido")
      return;
    }

    if(this.newMechanicalFile.shock_absorbers === "" || this.newMechanicalFile.shock_absorbers === undefined){

      this.utils.presentToast("El campo Amortiguadores es requerido")
      return;
    }

    if(this.newMechanicalFile.spirals === "" || this.newMechanicalFile.spirals === undefined){

      this.utils.presentToast("El campo Espirales es requerido")
      return;
    }

    if(this.newMechanicalFile.upper_lower_plateaus === "" || this.newMechanicalFile.upper_lower_plateaus === undefined){

      this.utils.presentToast("El campo Mesetas sup.e inf. es requerido")
      return;
    }

    if(this.newMechanicalFile.stumps === "" || this.newMechanicalFile.stumps === undefined){

      this.utils.presentToast("El campo Muñones es requerido")
      return;
    }

    if(this.newMechanicalFile.terminal_blocks === "" || this.newMechanicalFile.terminal_blocks === undefined){

      this.utils.presentToast("El campo Terminales de dirección es requerido")
      return;
    }

    if(this.newMechanicalFile.brakes === "" || this.newMechanicalFile.brakes === undefined){

      this.utils.presentToast("El campo Frenos es requerido")
      return;
    }

    if(this.newMechanicalFile.cardan_transmission_shaft === "" || this.newMechanicalFile.cardan_transmission_shaft === undefined){

      this.utils.presentToast("El campo Cardan o Eje de Transmisión es requerido")
      return;
    }

    if(this.newMechanicalFile.engine_transmission_oil_leaks === "" || this.newMechanicalFile.engine_transmission_oil_leaks === undefined){

      this.utils.presentToast("El campo Fugas de aceite de motor/transmisión es requerido")
      return;
    }

    if(this.newMechanicalFile.hydraulic_oil_leak_steering_box === "" || this.newMechanicalFile.hydraulic_oil_leak_steering_box === undefined){

      this.utils.presentToast("El campo Fuga de aceite hidráulico  en cajetín de dirección es requerido")
      return;
    }

    if(this.newMechanicalFile.excessive_rust_on_frame_compact === "" || this.newMechanicalFile.excessive_rust_on_frame_compact === undefined){

      this.utils.presentToast("El campo Oxido excesivo en el bastidor o compacto es requerido")
      return;
    }

    if(this.newMechanicalFile.exhaust_pipe === "" || this.newMechanicalFile.exhaust_pipe === undefined){

      this.utils.presentToast("El campo Tubo de escape es requerido")
      return;
    }

    if(this.newMechanicalFile.doors === "" || this.newMechanicalFile.doors === undefined){

      this.utils.presentToast("El campo Puertas es requerido")
      return;
    }

    if(this.newMechanicalFile.stop === "" || this.newMechanicalFile.stop === undefined){

      this.utils.presentToast("El campo Stop es requerido")
      return;
    }

    if(this.newMechanicalFile.fuel_pump_door === "" || this.newMechanicalFile.fuel_pump_door === undefined){

      this.utils.presentToast("El campo Compuerta del surtidor de combustible es requerido")
      return;
    }

    if(this.newMechanicalFile.trunk_door === "" || this.newMechanicalFile.trunk_door === undefined){

      this.utils.presentToast("El campo Puerta del Maletero es requerido")
      return;
    }

    if(this.newMechanicalFile.trunk_interior === "" || this.newMechanicalFile.trunk_interior === undefined){

      this.utils.presentToast("El campo Interior del Maletero es requerido")
      return;
    }

    if(this.newMechanicalFile.replacement_rubber_tool_set === "" || this.newMechanicalFile.replacement_rubber_tool_set === undefined){

      this.utils.presentToast("El campo Caucho de repuesto y Juego de Herramientas es requerido")
      return;
    }

    if(this.newMechanicalFile.complete_emblems === "" || this.newMechanicalFile.complete_emblems === undefined){

      this.utils.presentToast("El campo Emblemas completos es requerido")
      return;
    }

    if(this.newMechanicalFile.bodywork === "" || this.newMechanicalFile.bodywork === undefined){

      this.utils.presentToast("El campo Carrocería es requerido")
      return;
    }

    if(this.newMechanicalFile.paint === "" || this.newMechanicalFile.paint === undefined){

      this.utils.presentToast("El campo Pintura es requerido")
      return;
    }

    if(this.newMechanicalFile.tire_condition === "" || this.newMechanicalFile.tire_condition === undefined){

      this.utils.presentToast("El campo Estado de los neumáticos es requerido")
      return;
    }

    if(this.newMechanicalFile.wheel_ornaments === "" || this.newMechanicalFile.wheel_ornaments === undefined){

      this.utils.presentToast("El campo Ornamentos de ruedas es requerido")
      return;
    }

    if(this.newMechanicalFile.dealer_maintenance === "" || this.newMechanicalFile.dealer_maintenance === undefined){
      this.utils.presentToast("El campo Mantenimiento en concesionario es requerido");
      return;
    }

    this.disabledSave = true;
    this.utils.presentToast("Creando ficha mecánica")
    this.mechanicSrv.addMechanicalFile(this.newMechanicalFile).subscribe((res:any) => {
      if (res.status) {
        this.utils.dismissLoading()
        this.utils.presentToast("Se ha creado la ficha mecánica correctamente")
        this.router.navigate(['mechanic']);
        this.newMechanicalFile.steering_wheel = "";
        this.newMechanicalFile.pedals = "";
        this.newMechanicalFile.gauges_dashboard_lights = "";
        this.newMechanicalFile.transmission_shift_lever = "";
        this.newMechanicalFile.brake_lever = "";
        this.newMechanicalFile.accessories = "";
        this.newMechanicalFile.internal_upholstery = "";
        this.newMechanicalFile.courtesy_lights = "";
        this.newMechanicalFile.windshield = "";
        this.newMechanicalFile.window_glass_operation = "";
        this.newMechanicalFile.door_locks_handles = "";
        this.newMechanicalFile.operation_manual_electric_mirrors = "";
        this.newMechanicalFile.seat_belts = "";
        this.newMechanicalFile.front_bumpers = "";
        this.newMechanicalFile.front_grill = "";
        this.newMechanicalFile.headlights_low_beams_cocuyos = "";
        this.newMechanicalFile.fog_lights = "";
        this.newMechanicalFile.bonnet = "";
        this.newMechanicalFile.engine_ignition = "";
        this.newMechanicalFile.engine_noises = "";
        this.newMechanicalFile.general_condition_fluids = "";
        this.newMechanicalFile.fluid_reservoirs = "";
        this.newMechanicalFile.spark_plugs_coils_general_condition = "";
        this.newMechanicalFile.air_filter = "";
        this.newMechanicalFile.transmission_belts = "";
        this.newMechanicalFile.appearance_hoses_caps_seals_connections = "";
        this.newMechanicalFile.battery_condition_terminal_tightness_corrosion = "";
        this.newMechanicalFile.fluid_leak = "";
        this.newMechanicalFile.general_engine_compression_condition = "";
        this.newMechanicalFile.stabilizer_bars = "";
        this.newMechanicalFile.bearings = "";
        this.newMechanicalFile.joints_dust_covers = "";
        this.newMechanicalFile.shock_absorbers = "";
        this.newMechanicalFile.spirals = "";
        this.newMechanicalFile.upper_lower_plateaus = "";
        this.newMechanicalFile.stumps = "";
        this.newMechanicalFile.terminal_blocks = "";
        this.newMechanicalFile.brakes = "";
        this.newMechanicalFile.cardan_transmission_shaft = "";
        this.newMechanicalFile.engine_transmission_oil_leaks = "";
        this.newMechanicalFile.hydraulic_oil_leak_steering_box = "";
        this.newMechanicalFile.excessive_rust_on_frame_compact = "";
        this.newMechanicalFile.exhaust_pipe = "";
        this.newMechanicalFile.doors = "";
        this.newMechanicalFile.stop = "";
        this.newMechanicalFile.fuel_pump_door = "";
        this.newMechanicalFile.trunk_door = "";
        this.newMechanicalFile.trunk_interior = "";
        this.newMechanicalFile.replacement_rubber_tool_set = "";
        this.newMechanicalFile.complete_emblems = "";
        this.newMechanicalFile.bodywork = "";
        this.newMechanicalFile.paint = "";
        this.newMechanicalFile.tire_condition = "";
        this.newMechanicalFile.wheel_ornaments = "";
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
  
  public generalCondition(event: any){
  
    let total = 
    Number(this.newMechanicalFile.steering_wheel) +
    Number(this.newMechanicalFile.pedals) +
    Number(this.newMechanicalFile.gauges_dashboard_lights) +
    Number(this.newMechanicalFile.transmission_shift_lever) +
    Number(this.newMechanicalFile.brake_lever) +
    Number(this.newMechanicalFile.accessories) +
    Number(this.newMechanicalFile.internal_upholstery) +
    Number(this.newMechanicalFile.courtesy_lights) +
    Number(this.newMechanicalFile.windshield) +
    Number(this.newMechanicalFile.window_glass_operation) +
    Number(this.newMechanicalFile.door_locks_handles) +
    Number(this.newMechanicalFile.operation_manual_electric_mirrors) +
    Number(this.newMechanicalFile.seat_belts) +
    Number(this.newMechanicalFile.front_bumpers) +
    Number(this.newMechanicalFile.front_grill) +
    Number(this.newMechanicalFile.headlights_low_beams_cocuyos) +
    Number(this.newMechanicalFile.fog_lights) +
    Number(this.newMechanicalFile.bonnet) +
    Number(this.newMechanicalFile.engine_ignition) +
    Number(this.newMechanicalFile.engine_noises) +
    Number(this.newMechanicalFile.general_condition_fluids) +
    Number(this.newMechanicalFile.fluid_reservoirs) +
    Number(this.newMechanicalFile.spark_plugs_coils_general_condition) +
    Number(this.newMechanicalFile.air_filter) +
    Number(this.newMechanicalFile.transmission_belts) +
    Number(this.newMechanicalFile.appearance_hoses_caps_seals_connections) +
    Number(this.newMechanicalFile.battery_condition_terminal_tightness_corrosion) +
    Number(this.newMechanicalFile.fluid_leak) +
    Number(this.newMechanicalFile.general_engine_compression_condition) +
    Number(this.newMechanicalFile.stabilizer_bars) +
    Number(this.newMechanicalFile.bearings) +
    Number(this.newMechanicalFile.joints_dust_covers) +
    Number(this.newMechanicalFile.shock_absorbers) +
    Number(this.newMechanicalFile.spirals) +
    Number(this.newMechanicalFile.upper_lower_plateaus) +
    Number(this.newMechanicalFile.stumps) +
    Number(this.newMechanicalFile.terminal_blocks) +
    Number(this.newMechanicalFile.brakes) +
    Number(this.newMechanicalFile.cardan_transmission_shaft) +
    Number(this.newMechanicalFile.engine_transmission_oil_leaks) +
    Number(this.newMechanicalFile.hydraulic_oil_leak_steering_box) +
    Number(this.newMechanicalFile.excessive_rust_on_frame_compact) +
    Number(this.newMechanicalFile.exhaust_pipe) +
    Number(this.newMechanicalFile.doors) +
    Number(this.newMechanicalFile.stop) +
    Number(this.newMechanicalFile.fuel_pump_door) +
    Number(this.newMechanicalFile.trunk_door) +
    Number(this.newMechanicalFile.trunk_interior) +
    Number(this.newMechanicalFile.replacement_rubber_tool_set) +
    Number(this.newMechanicalFile.complete_emblems) +
    Number(this.newMechanicalFile.bodywork) +
    Number(this.newMechanicalFile.paint) +
    Number(this.newMechanicalFile.tire_condition) +
    Number(this.newMechanicalFile.wheel_ornaments) 
    
    this.newMechanicalFile.general_condition = total;
  }

}
