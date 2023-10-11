import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AddMechanicFile } from 'src/models/sellet';
import { MechanicService } from '../services/mechanic/mechanic.service';
import { UtilsService } from '../services/utils/utils.service';

@Component({
  selector: 'app-mechanical-file',
  templateUrl: './mechanical-file.page.html',
  styleUrls: ['./mechanical-file.page.scss'],
})
export class MechanicalFilePage implements OnInit {
  newMechanicalFile: AddMechanicFile = new AddMechanicFile();

  android: boolean = false;
  ios: boolean = false;
  web: boolean = false;
  id_vehicle: string = "";

  constructor(private router: Router, private platform: Platform, private actRoute: ActivatedRoute, private mechanicSrv: MechanicService, private utils: UtilsService) {

    this.id_vehicle = this.actRoute.snapshot.params['id'];

    // if(this.platform.is('android')){
    //   this.android = true;
    // } else if(this.platform.is('ios')){
    //   this.ios = true;
    // } else if(this.platform.is('mobileweb')){
    //   this.web = true;
    // }

    let data = localStorage.getItem('me');

    if (data != null) {
      let me = JSON.parse(data);
      this.newMechanicalFile.id_mechanic = me.id;
    }

    this.newMechanicalFile.part_emblems_complete = "";
    this.newMechanicalFile.wiper_shower_brushes_windshield = "";
    this.newMechanicalFile.hits = "";
    this.newMechanicalFile.scratches = "";
    this.newMechanicalFile.paint_condition = "";
    this.newMechanicalFile.bugle_accessories = "";
    this.newMechanicalFile.air_conditioning_system = "";
    this.newMechanicalFile.radio_player = "";
    this.newMechanicalFile.courtesy_lights = "";
    this.newMechanicalFile.upholstery_condition = "";
    this.newMechanicalFile.gts = "";
    this.newMechanicalFile.board_lights = "";
    this.newMechanicalFile.tire_pressure = "";
    this.newMechanicalFile.tire_life = "";
    this.newMechanicalFile.battery_status_terminals = "";
    this.newMechanicalFile.transmitter_belts = "";
    this.newMechanicalFile.motor_oil = "";
    this.newMechanicalFile.engine_coolant_container = "";
    this.newMechanicalFile.radiator_status = "";
    this.newMechanicalFile.exhaust_pipe_bracket = "";
    this.newMechanicalFile.fuel_tank_cover_pipes_hoses_connections = "";
    this.newMechanicalFile.distribution_mail = "";
    this.newMechanicalFile.spark_plugs_air_filter_fuel_filter_anti_pollen_filter = "";
    this.newMechanicalFile.fuel_system = "";
    this.newMechanicalFile.parking_break = "";
    this.newMechanicalFile.brake_bands_drums = "";
    this.newMechanicalFile.brake_pads_discs = "";
    this.newMechanicalFile.brake_pipes_hoses = "";
    this.newMechanicalFile.master_cylinder = "";
    this.newMechanicalFile.brake_fluid = "";
    this.newMechanicalFile.bushings_plateaus = "";
    this.newMechanicalFile.stumps = "";
    this.newMechanicalFile.terminals = "";
    this.newMechanicalFile.stabilizer_bar = "";
    this.newMechanicalFile.bearings = "";
    this.newMechanicalFile.tripoids_rubbe_bands = "";
    this.newMechanicalFile.shock_absorbers_coils = "";
    this.newMechanicalFile.dealer_maintenance = "";
    this.newMechanicalFile.id_vehicle = this.id_vehicle;
  }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['/car-detail-mechanic/'+this.id_vehicle]);
  }

  public saveMechanicalFile(){

    if(this.newMechanicalFile.air_conditioning_system === "" || this.newMechanicalFile.air_conditioning_system === undefined){
      this.utils.presentToast("El campo sistema de aire acondicionado es requerido");
      return;
    }

    if(this.newMechanicalFile.battery_status_terminals === "" || this.newMechanicalFile.battery_status_terminals === undefined){
      this.utils.presentToast("El campo Estado de la batería - Bornes es requerido");
      return;
    }

    if(this.newMechanicalFile.board_lights === "" || this.newMechanicalFile.board_lights === undefined){
      this.utils.presentToast("El campo luces del tablero es requerido");
      return;
    }

    if(this.newMechanicalFile.brake_bands_drums === "" || this.newMechanicalFile.brake_bands_drums === undefined){
      this.utils.presentToast("El campo Bandas de freno y tambores es requerido");
      return;
    }

    if(this.newMechanicalFile.brake_fluid === "" || this.newMechanicalFile.brake_fluid === undefined){
      this.utils.presentToast("El campo Fluido de frenos es requerido");
      return;
    }

    if(this.newMechanicalFile.brake_pads_discs === "" || this.newMechanicalFile.brake_pads_discs === undefined){
      this.utils.presentToast("El campo Pastillas de freno y discos es requerido");
      return;
    }

    if(this.newMechanicalFile.brake_pipes_hoses === "" || this.newMechanicalFile.brake_pipes_hoses === undefined){
      this.utils.presentToast("El campo Tubos y mangueras de freno es requerido");
      return;
    }

    if(this.newMechanicalFile.bugle_accessories === "" || this.newMechanicalFile.bugle_accessories === undefined){
      this.utils.presentToast("El campo Corneta - Accesorios es requerido");
      return;
    }

    if(this.newMechanicalFile.bushings_plateaus === "" || this.newMechanicalFile.bushings_plateaus === undefined){
      this.utils.presentToast("El campo Bujes y mesetas es requerido");
      return;
    }

    if(this.newMechanicalFile.courtesy_lights === "" || this.newMechanicalFile.courtesy_lights === undefined){
      this.utils.presentToast("El campo Luces de cortesía es requerido");
      return;
    }

    if(this.newMechanicalFile.dealer_maintenance === "" || this.newMechanicalFile.dealer_maintenance === undefined){
      this.utils.presentToast("El campo Mantenimiento en concesionario es requerido")
      return;
    }

    if(this.newMechanicalFile.distribution_mail === "" || this.newMechanicalFile.distribution_mail === undefined){
      this.utils.presentToast("El campo Correo de distribución es requerido")
      return;
    }

    if(this.newMechanicalFile.engine_coolant_container === "" || this.newMechanicalFile.engine_coolant_container === undefined){
      this.utils.presentToast("El campo Refrigerante del motor - Envase es requerido")
      return;
    }

    if(this.newMechanicalFile.exhaust_pipe_bracket === "" || this.newMechanicalFile.exhaust_pipe_bracket === undefined){
      this.utils.presentToast("El campo Tubo de escape y soporte es requerido")
      return;
    }

    if(this.newMechanicalFile.fuel_system === "" || this.newMechanicalFile.fuel_system === undefined){
      this.utils.presentToast("El campo Sistema de combustible es requerido")
      return;
    }

    if(this.newMechanicalFile.fuel_tank_cover_pipes_hoses_connections === "" || this.newMechanicalFile.fuel_tank_cover_pipes_hoses_connections === undefined){
      this.utils.presentToast("El Condición del tanque de combustible, tapa tubos, mangueras y conexiones  es requerido")
      return;
    }

    if(this.newMechanicalFile.gts === "" || this.newMechanicalFile.gts === undefined){
      this.utils.presentToast("El campo Revisión del sistema del vehículo a través de tester inteligente o GTS requerido")
      return;
    }

    if (this.newMechanicalFile.hits === "" || this.newMechanicalFile.hits === undefined){
      this.utils.presentToast("El campo Golpes es requerido")
      return;
    }

    if(this.newMechanicalFile.master_cylinder === "" || this.newMechanicalFile.master_cylinder === undefined){
      this.utils.presentToast("El campo Bomba de freno es requerido")
      return;
    }

    if(this.newMechanicalFile.motor_oil === "" || this.newMechanicalFile.motor_oil === undefined){
      this.utils.presentToast("El campo Aceite de motor es requerido")
      return;
    }

    if(this.newMechanicalFile.paint_condition === "" || this.newMechanicalFile.paint_condition === undefined){
      this.utils.presentToast("El campo condiciones de la pintura es requerido")
      return;
    }

    if(this.newMechanicalFile.parking_break === "" || this.newMechanicalFile.parking_break === undefined){
      this.utils.presentToast("El campo Frenos de estacionamiento es requerido")
      return;
    }

    if(this.newMechanicalFile.part_emblems_complete === "" || this.newMechanicalFile.part_emblems_complete === undefined){
      this.utils.presentToast("El campo Piezas completas - Emblemas completos es requerido")
      return;
    }

    if(this.newMechanicalFile.radiator_status === "" || this.newMechanicalFile.radiator_status === undefined){
      this.utils.presentToast("El campo Estado del radiador es requerido")
      return;
    }

    if(this.newMechanicalFile.radio_player === "" || this.newMechanicalFile.radio_player === undefined){
      this.utils.presentToast("El campo Radio reproductor es requerido")
      return;
    }

    if(this.newMechanicalFile.scratches === "" || this.newMechanicalFile.scratches === undefined){
      this.utils.presentToast("El campo Rayones es requerido")
      return;
    }

    if(this.newMechanicalFile.shock_absorbers_coils === "" || this.newMechanicalFile.shock_absorbers_coils === undefined){
      this.utils.presentToast("El campo Amortiguadores y Espirales es requerido")
      return;
    }

    if(this.newMechanicalFile.spark_plugs_air_filter_fuel_filter_anti_pollen_filter === "" || this.newMechanicalFile.spark_plugs_air_filter_fuel_filter_anti_pollen_filter === undefined){
      this.utils.presentToast("El campo Bujías - Filtro de aire - Filtro de gasolina - filtro anti polen es requerido")
      return;
    }

    if(this.newMechanicalFile.stabilizer_bar === "" || this.newMechanicalFile.stabilizer_bar === undefined){
      this.utils.presentToast("El campo Barra estabilizadora es requerido")
      return;
    }

    if(this.newMechanicalFile.stumps === "" || this.newMechanicalFile.stumps === undefined){
      this.utils.presentToast("El Muñones es requerido")
      return;
    }

    if(this.newMechanicalFile.terminals === "" || this.newMechanicalFile.terminals === undefined){
      this.utils.presentToast("El campo Terminales es requerido")
      return;
    }

    if(this.newMechanicalFile.tire_pressure === "" || this.newMechanicalFile.tire_pressure === undefined){
      this.utils.presentToast("El campo Presion de los neumaticos es requerido")
      return;
    }

    if(this.newMechanicalFile.tire_life === "" || this.newMechanicalFile.tire_life === undefined){
      this.utils.presentToast("El campo Vida de los neumaticos es requerido")
      return;
    }

    if(this.newMechanicalFile.transmitter_belts === "" || this.newMechanicalFile.transmitter_belts === undefined){
      this.utils.presentToast("El campo Correas transmisoras es requerido")
      return;
    }

    if(this.newMechanicalFile.tripoids_rubbe_bands === "" || this.newMechanicalFile.tripoids_rubbe_bands === undefined){
      this.utils.presentToast("El Tripoides y gomas es requerido")
      return;
    }

    if(this.newMechanicalFile.upholstery_condition === "" || this.newMechanicalFile.upholstery_condition === undefined){
      this.utils.presentToast("El campo Estado de la tapicería es requerido")
      return;
    }

    if(this.newMechanicalFile.wiper_shower_brushes_windshield === "" || this.newMechanicalFile.wiper_shower_brushes_windshield === undefined){
      this.utils.presentToast("El Cepillos limpia parabrisas-Ducha Limpia parabrisas es requerido")
      return;
    }

    if(this.newMechanicalFile.id_mechanic === "" || this.newMechanicalFile.id_mechanic === undefined){
      this.utils.presentToast("El campo id del técnico es requerido")
      return;
    }

    if(this.newMechanicalFile.id_vehicle === "" || this.newMechanicalFile.id_vehicle === undefined){

      this.utils.presentToast("El campo id del vehículo es requerido")
      return;
    }

    this.mechanicSrv.addMechanicalFile(this.newMechanicalFile).subscribe((res:any) => {
      this.utils.presentLoading("Creando ficha mecánica")
      if (res.data.status) {
        this.utils.dismissLoading()
        this.utils.presentToast("Se ha creado la ficha mecánica correctamente")
        this.router.navigate(['mechanic'])
        this.newMechanicalFile.part_emblems_complete = "";
        this.newMechanicalFile.wiper_shower_brushes_windshield = "";
        this.newMechanicalFile.hits = "";
        this.newMechanicalFile.scratches = "";
        this.newMechanicalFile.paint_condition = "";
        this.newMechanicalFile.bugle_accessories = "";
        this.newMechanicalFile.air_conditioning_system = "";
        this.newMechanicalFile.radio_player = "";
        this.newMechanicalFile.courtesy_lights = "";
        this.newMechanicalFile.upholstery_condition = "";
        this.newMechanicalFile.gts = "";
        this.newMechanicalFile.board_lights = "";
        this.newMechanicalFile.tire_pressure = "";
        this.newMechanicalFile.tire_life = "";
        this.newMechanicalFile.battery_status_terminals = "";
        this.newMechanicalFile.transmitter_belts = "";
        this.newMechanicalFile.motor_oil = "";
        this.newMechanicalFile.engine_coolant_container = "";
        this.newMechanicalFile.radiator_status = "";
        this.newMechanicalFile.exhaust_pipe_bracket = "";
        this.newMechanicalFile.fuel_tank_cover_pipes_hoses_connections = "";
        this.newMechanicalFile.distribution_mail = "";
        this.newMechanicalFile.spark_plugs_air_filter_fuel_filter_anti_pollen_filter = "";
        this.newMechanicalFile.fuel_system = "";
        this.newMechanicalFile.parking_break = "";
        this.newMechanicalFile.brake_bands_drums = "";
        this.newMechanicalFile.brake_pads_discs = "";
        this.newMechanicalFile.brake_pipes_hoses = "";
        this.newMechanicalFile.master_cylinder = "";
        this.newMechanicalFile.brake_fluid = "";
        this.newMechanicalFile.bushings_plateaus = "";
        this.newMechanicalFile.stumps = "";
        this.newMechanicalFile.terminals = "";
        this.newMechanicalFile.stabilizer_bar = "";
        this.newMechanicalFile.bearings = "";
        this.newMechanicalFile.tripoids_rubbe_bands = "";
        this.newMechanicalFile.shock_absorbers_coils = "";
        this.newMechanicalFile.dealer_maintenance = "";
      }else{
        this.utils.dismissLoading()
        this.utils.presentToast("Ha ocurrido un error al crear la ficha mecánica")
      }
    }
    ,(err) => {
      this.utils.presentToast("Ha ocurrido un error al crear la ficha mecánica")
    }
    )

  }

  public rejectMechanicalFile(){
    let data = {
      id_vehicle: this.id_vehicle
    }
    
    this.mechanicSrv.rejectMechanicalFile(data).subscribe((res:any) => {
      this.utils.presentLoading("Rechazando ficha mecánica")
      if (res.data.status) {
        this.utils.dismissLoading()
        this.utils.presentToast("Se ha rechazado la ficha mecánica correctamente")
        this.router.navigate(['mechanic'])
      }else{
        this.utils.dismissLoading()
        this.utils.presentToast("Ha ocurrido un error al rechazar la ficha mecánica")
      }
    }
    ,(err:any) => {
      this.utils.presentToast("Ha ocurrido un error al rechazar la ficha mecánica")
    })
  }

}
