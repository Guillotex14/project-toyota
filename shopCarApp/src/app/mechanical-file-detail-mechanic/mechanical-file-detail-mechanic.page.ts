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

    this.mechanicalFileDetail.id_vehicle= "";
    this.mechanicalFileDetail.id_mechanic= "";
    this.mechanicalFileDetail.part_emblems_complete = "";
    this.mechanicalFileDetail.wiper_shower_brushes_windshield = "";
    this.mechanicalFileDetail.hits = "";
    this.mechanicalFileDetail.paint_condition = "";
    this.mechanicalFileDetail.bugle_accessories = "";
    this.mechanicalFileDetail.air_conditioning_system = "";
    this.mechanicalFileDetail.radio_player = "";
    this.mechanicalFileDetail.courtesy_lights = "";
    this.mechanicalFileDetail.upholstery_condition = "";
    this.mechanicalFileDetail.board_lights = "";
    this.mechanicalFileDetail.tire_life = "";
    this.mechanicalFileDetail.battery_status_terminals = "";
    this.mechanicalFileDetail.transmitter_belts = "";
    this.mechanicalFileDetail.motor_oil = "";
    this.mechanicalFileDetail.engine_coolant_container = "";
    this.mechanicalFileDetail.radiator_status = "";
    this.mechanicalFileDetail.exhaust_pipe_bracket = "";
    this.mechanicalFileDetail.distribution_mail = "";
    this.mechanicalFileDetail.fuel_system = "";
    this.mechanicalFileDetail.parking_break = "";
    this.mechanicalFileDetail.brake_bands_drums = "";
    this.mechanicalFileDetail.brake_pads_discs = "";
    this.mechanicalFileDetail.master_cylinder = "";
    this.mechanicalFileDetail.brake_fluid = "";
    this.mechanicalFileDetail.bushings_plateaus = "";
    this.mechanicalFileDetail.stumps = "";
    this.mechanicalFileDetail.terminals = "";
    this.mechanicalFileDetail.stabilizer_bar = "";
    this.mechanicalFileDetail.bearings = "";
    this.mechanicalFileDetail.tripoids_rubbe_bands = "";
    this.mechanicalFileDetail.shock_absorbers_coils = "";
    this.mechanicalFileDetail.dealer_maintenance = "";
    this.mechanicalFileDetail.general_condition = "";
    this.mechanicalFileDetail.odometer = "";
    this.mechanicalFileDetail.engine_start = "";
    this.mechanicalFileDetail.windshields_glass = "";
    this.mechanicalFileDetail.hits_scratches = "";
    this.mechanicalFileDetail.spark_plugs = "";
    this.mechanicalFileDetail.injectors = "";
    this.mechanicalFileDetail.fuel_filter_anti_pollen_filter = "";
    this.mechanicalFileDetail.engine_noises = "";
    this.mechanicalFileDetail.hits_scratches_sides = "";
    this.mechanicalFileDetail.paint_condition_sides = "";
    this.mechanicalFileDetail.trunk_hatch = "";
    this.mechanicalFileDetail.spare_tire = "";
    this.mechanicalFileDetail.hits_scratches_trunk = "";
    this.mechanicalFileDetail.paint_condition_trunk = "";
    this.mechanicalFileDetail.headlights_lights_trunk = "";
    this.mechanicalFileDetail.fuel_tank_cover = "";
    this.mechanicalFileDetail.pipes_hoses_connections = "";
    this.mechanicalFileDetail.brake_discs = "";
    this.mechanicalFileDetail.vehicle = {
      price_ofert: null
    }
    this.mechanicalFileDetail.mechanic = {
      fullName: null
    }
    
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
        console.log(this.mechanicalFileDetail.vehicle.price_ofert)
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

      console.log(res)
    },(error)=>{
      this.utils.dismissLoading()
        this.utils.presentToast("Error de servidor")
    })
  }

  public generalCondition(event: any){
    let total = Number(this.mechanicalFileDetail.part_emblems_complete) +
    Number(this.mechanicalFileDetail.wiper_shower_brushes_windshield) +
    Number(this.mechanicalFileDetail.paint_condition) +
    Number(this.mechanicalFileDetail.bugle_accessories) +
    Number(this.mechanicalFileDetail.air_conditioning_system) +
    Number(this.mechanicalFileDetail.radio_player) +
    Number(this.mechanicalFileDetail.courtesy_lights) +
    Number(this.mechanicalFileDetail.upholstery_condition) +
    Number(this.mechanicalFileDetail.board_lights) +
    Number(this.mechanicalFileDetail.tire_life) +
    Number(this.mechanicalFileDetail.battery_status_terminals) +
    Number(this.mechanicalFileDetail.transmitter_belts) +
    Number(this.mechanicalFileDetail.motor_oil) +
    Number(this.mechanicalFileDetail.engine_coolant_container) +
    Number(this.mechanicalFileDetail.radiator_status) +
    Number(this.mechanicalFileDetail.exhaust_pipe_bracket) +
    Number(this.mechanicalFileDetail.distribution_mail) +
    Number(this.mechanicalFileDetail.fuel_system) +
    Number(this.mechanicalFileDetail.parking_break) +
    Number(this.mechanicalFileDetail.brake_bands_drums) +
    Number(this.mechanicalFileDetail.brake_pads_discs) +
    Number(this.mechanicalFileDetail.master_cylinder) +
    Number(this.mechanicalFileDetail.brake_fluid) +
    Number(this.mechanicalFileDetail.bushings_plateaus) +
    Number(this.mechanicalFileDetail.stumps) +
    Number(this.mechanicalFileDetail.terminals) +
    Number(this.mechanicalFileDetail.stabilizer_bar) +
    Number(this.mechanicalFileDetail.bearings) +
    Number(this.mechanicalFileDetail.tripoids_rubbe_bands) +
    Number(this.mechanicalFileDetail.shock_absorbers_coils) +
    Number(this.mechanicalFileDetail.odometer) +
    Number(this.mechanicalFileDetail.engine_start) +
    Number(this.mechanicalFileDetail.windshields_glass) +
    Number(this.mechanicalFileDetail.hits_scratches) +
    Number(this.mechanicalFileDetail.spark_plugs) +
    Number(this.mechanicalFileDetail.injectors) +
    Number(this.mechanicalFileDetail.fuel_filter_anti_pollen_filter) +
    Number(this.mechanicalFileDetail.engine_noises) +
    Number(this.mechanicalFileDetail.hits_scratches_sides) +
    Number(this.mechanicalFileDetail.paint_condition_sides) +
    Number(this.mechanicalFileDetail.trunk_hatch) +
    Number(this.mechanicalFileDetail.spare_tire) +
    Number(this.mechanicalFileDetail.hits_scratches_trunk) +
    Number(this.mechanicalFileDetail.paint_condition_trunk) +
    Number(this.mechanicalFileDetail.headlights_lights_trunk) +
    Number(this.mechanicalFileDetail.fuel_tank_cover) +
    Number(this.mechanicalFileDetail.pipes_hoses_connections) +
    Number(this.mechanicalFileDetail.brake_discs);

    this.mechanicalFileDetail.general_condition = total;
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
