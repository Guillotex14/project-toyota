import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, Platform } from '@ionic/angular';
import { AddMechanicFile } from 'src/models/sellet';
import { MechanicService } from '../services/mechanic/mechanic.service';
import { UtilsService } from '../services/utils/utils.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-mechanic-file',
  templateUrl: './add-mechanic-file.page.html',
  styleUrls: ['./add-mechanic-file.page.scss'],
})
export class AddMechanicFilePage implements OnInit {

  newMechanicalFile: AddMechanicFile = new AddMechanicFile();

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

    this.newMechanicalFile.part_emblems_complete = "";
    this.newMechanicalFile.wiper_shower_brushes_windshield = "";
    this.newMechanicalFile.paint_condition = "";
    this.newMechanicalFile.bugle_accessories = "";
    this.newMechanicalFile.air_conditioning_system = "";
    this.newMechanicalFile.radio_player = "";
    this.newMechanicalFile.courtesy_lights = "";
    this.newMechanicalFile.upholstery_condition = "";
    this.newMechanicalFile.board_lights = "";
    this.newMechanicalFile.tire_life = "";
    this.newMechanicalFile.battery_status_terminals = "";
    this.newMechanicalFile.transmitter_belts = "";
    this.newMechanicalFile.motor_oil = "";
    this.newMechanicalFile.engine_coolant_container = "";
    this.newMechanicalFile.radiator_status = "";
    this.newMechanicalFile.exhaust_pipe_bracket = "";
    this.newMechanicalFile.distribution_mail = "";
    this.newMechanicalFile.fuel_system = "";
    this.newMechanicalFile.parking_break = "";
    this.newMechanicalFile.brake_bands_drums = "";
    this.newMechanicalFile.brake_pads_discs = "";
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
    this.newMechanicalFile.general_condition = "";
    this.newMechanicalFile.odometer = "";
    this.newMechanicalFile.engine_start = "";
    this.newMechanicalFile.windshields_glass = "";
    this.newMechanicalFile.hits_scratches = "";
    this.newMechanicalFile.spark_plugs = "";
    this.newMechanicalFile.injectors = "";
    this.newMechanicalFile.fuel_filter_anti_pollen_filter = "";
    this.newMechanicalFile.engine_noises = "";
    this.newMechanicalFile.hits_scratches_sides = "";
    this.newMechanicalFile.paint_condition_sides = "";
    this.newMechanicalFile.trunk_hatch = "";
    this.newMechanicalFile.spare_tire = "";
    this.newMechanicalFile.hits_scratches_trunk = "";
    this.newMechanicalFile.paint_condition_trunk = "";
    this.newMechanicalFile.headlights_lights_trunk = "";
    this.newMechanicalFile.fuel_tank_cover = "";
    this.newMechanicalFile.pipes_hoses_connections = "";
    this.newMechanicalFile.brake_discs = "";
    this.newMechanicalFile.id_vehicle = this.id_vehicle;
  }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['/car-detail-mechanic/'+this.id_vehicle+'/'+this.theRoute]);
    this.disabledSave = false;
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

    if(this.newMechanicalFile.shock_absorbers_coils === "" || this.newMechanicalFile.shock_absorbers_coils === undefined){
      this.utils.presentToast("El campo Amortiguadores y Espirales es requerido")
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
      this.utils.presentToast("El campo id del Técnico es requerido")
      return;
    }
    
    if(this.newMechanicalFile.id_vehicle === "" || this.newMechanicalFile.id_vehicle === undefined){

      this.utils.presentToast("El campo id del vehículo es requerido")
      return;
    }

    if(this.newMechanicalFile.general_condition === "" || this.newMechanicalFile.general_condition === undefined){

      this.utils.presentToast("El campo Condición general es requerido")
      return;
    }
//////////////////////////////////////////////////////////////
    if(this.newMechanicalFile.odometer === "" || this.newMechanicalFile.odometer === undefined){

      this.utils.presentToast("El campo odómetro es requerido")
      return;
    }

    if(this.newMechanicalFile.engine_start === "" || this.newMechanicalFile.engine_start === undefined){

      this.utils.presentToast("El campo Arranque de motor es requerido")
      return;
    }

    if(this.newMechanicalFile.hits_scratches === "" || this.newMechanicalFile.hits_scratches === undefined){

      this.utils.presentToast("El campo Golpes - Rayones - Abolladuras es requerido")
      return;
    }

    if(this.newMechanicalFile.spark_plugs === "" || this.newMechanicalFile.spark_plugs === undefined){

      this.utils.presentToast("El campo Bujías es requerido")
      return;
    }

    if(this.newMechanicalFile.injectors === "" || this.newMechanicalFile.injectors === undefined){

      this.utils.presentToast("El campo Inyectores es requerido")
      return;
    }

    if(this.newMechanicalFile.fuel_filter_anti_pollen_filter === "" || this.newMechanicalFile.fuel_filter_anti_pollen_filter === undefined){

      this.utils.presentToast("El campo Filtro de gasolína - Filtro anti polen es requerido")
      return;
    }

    if(this.newMechanicalFile.engine_noises === "" || this.newMechanicalFile.engine_noises === undefined){

      this.utils.presentToast("El campo Ruidos de motor es requerido")
      return;
    }

    if(this.newMechanicalFile.hits_scratches_sides === "" || this.newMechanicalFile.hits_scratches_sides === undefined){

      this.utils.presentToast("El campo Golpes - Rayones - Abolladuras laterales es requerido")
      return;
    }

    if(this.newMechanicalFile.paint_condition_sides === "" || this.newMechanicalFile.paint_condition_sides === undefined){

      this.utils.presentToast("El campo Estado de la pintura laterales es requerido")
      return;
    }

    if(this.newMechanicalFile.trunk_hatch === "" || this.newMechanicalFile.trunk_hatch === undefined){

      this.utils.presentToast("El campo Compuerta de maletera es requerido")
      return;
    }

    if(this.newMechanicalFile.spare_tire === "" || this.newMechanicalFile.spare_tire === undefined){

      this.utils.presentToast("El campo Caucho de Repuesto y su compartimiento es requerido")
      return;
    }

    if(this.newMechanicalFile.hits_scratches_trunk === "" || this.newMechanicalFile.hits_scratches_trunk === undefined){

      this.utils.presentToast("El campo Golpes - Rayones - Abolladuras maletero es requerido")
      return;
    }

    if(this.newMechanicalFile.paint_condition_trunk === "" || this.newMechanicalFile.paint_condition_trunk === undefined){

      this.utils.presentToast("El campo Estado de la pintura maletero es requerido")
      return;
    }

    if(this.newMechanicalFile.headlights_lights_trunk === "" || this.newMechanicalFile.headlights_lights_trunk === undefined){

      this.utils.presentToast("El campo Faros - Luces maletero es requerido")
      return;
    }

    if(this.newMechanicalFile.fuel_tank_cover === "" || this.newMechanicalFile.fuel_tank_cover === undefined){

      this.utils.presentToast("El campo Condición del tanque de combustible es requerido")
      return;
    }

    if(this.newMechanicalFile.pipes_hoses_connections === "" || this.newMechanicalFile.pipes_hoses_connections === undefined){

      this.utils.presentToast("El campo Tapa tubos, mangueras y conexiones es requerido")
      return;
    }

    if(this.newMechanicalFile.brake_discs === "" || this.newMechanicalFile.brake_discs === undefined){

      this.utils.presentToast("El campo Discos de frenos es requerido")
      return;
    }

    this.disabledSave = true;
    this.utils.presentToast("Creando ficha mecánica")
    this.mechanicSrv.addMechanicalFile(this.newMechanicalFile).subscribe((res:any) => {
      if (res.status) {
        this.utils.dismissLoading()
        this.utils.presentToast("Se ha creado la ficha mecánica correctamente")
        this.router.navigate(['mechanic']);
        this.newMechanicalFile.part_emblems_complete = "";
        this.newMechanicalFile.wiper_shower_brushes_windshield = "";
        this.newMechanicalFile.paint_condition = "";
        this.newMechanicalFile.bugle_accessories = "";
        this.newMechanicalFile.air_conditioning_system = "";
        this.newMechanicalFile.radio_player = "";
        this.newMechanicalFile.courtesy_lights = "";
        this.newMechanicalFile.upholstery_condition = "";
        this.newMechanicalFile.board_lights = "";
        this.newMechanicalFile.tire_life = "";
        this.newMechanicalFile.battery_status_terminals = "";
        this.newMechanicalFile.transmitter_belts = "";
        this.newMechanicalFile.motor_oil = "";
        this.newMechanicalFile.engine_coolant_container = "";
        this.newMechanicalFile.radiator_status = "";
        this.newMechanicalFile.exhaust_pipe_bracket = "";
        this.newMechanicalFile.fuel_system = "";
        this.newMechanicalFile.parking_break = "";
        this.newMechanicalFile.brake_bands_drums = "";
        this.newMechanicalFile.brake_pads_discs = "";
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
        this.newMechanicalFile.general_condition = "";
        this.newMechanicalFile.odometer = "";
        this.newMechanicalFile.engine_start = "";
        this.newMechanicalFile.windshields_glass = "";
        this.newMechanicalFile.hits_scratches = "";
        this.newMechanicalFile.spark_plugs = "";
        this.newMechanicalFile.injectors = "";
        this.newMechanicalFile.fuel_filter_anti_pollen_filter = "";
        this.newMechanicalFile.engine_noises = "";
        this.newMechanicalFile.hits_scratches_sides = "";
        this.newMechanicalFile.paint_condition_sides = "";
        this.newMechanicalFile.trunk_hatch = "";
        this.newMechanicalFile.spare_tire = "";
        this.newMechanicalFile.hits_scratches_trunk = "";
        this.newMechanicalFile.paint_condition_trunk = "";
        this.newMechanicalFile.headlights_lights_trunk = "";
        this.newMechanicalFile.fuel_tank_cover = "";
        this.newMechanicalFile.pipes_hoses_connections = "";
        this.newMechanicalFile.brake_discs = "";
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
  
}
