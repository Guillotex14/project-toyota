import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform, IonContent, AlertController } from '@ionic/angular';
import { UtilsService } from '../services/utils/utils.service';
import { SellerService } from '../services/seller/seller.service';
import { CarDetailMechanicalFile } from 'src/models/sellet';

@Component({
  selector: 'app-mechanical-file-detail',
  templateUrl: './mechanical-file-detail.page.html',
  styleUrls: ['./mechanical-file-detail.page.scss'],
})
export class MechanicalFileDetailPage implements OnInit {

  android: boolean = false;
  ios: boolean = false;
  web: boolean = false;
  backToTop: boolean = false;
  id: string = "";
  theRoute: string = "";
  loading: boolean = true;
  reportes: any[] = [];
  mechanicalFile: CarDetailMechanicalFile = new CarDetailMechanicalFile();
  @ViewChild(IonContent) content!: IonContent;

  constructor(private alertController: AlertController, private route: Router, private platform: Platform, private actRoute: ActivatedRoute, private sellerSrv: SellerService, private utils: UtilsService) {
    this.id = this.actRoute.snapshot.params['id'];
    this.theRoute = this.actRoute.snapshot.params['route'];
    if (platform.is('android')) {
      this.android = true;
    } else if (platform.is('ios')) {
      this.ios = true;
    } else if (platform.is('mobileweb')) {
      this.web = true;
    }

    this.mechanicalFile.part_emblems_complete = "";
    this.mechanicalFile.wiper_shower_brushes_windshield = "";
    this.mechanicalFile.hits = "";
    this.mechanicalFile.paint_condition = "";
    this.mechanicalFile.bugle_accessories = "";
    this.mechanicalFile.air_conditioning_system = "";
    this.mechanicalFile.radio_player = "";
    this.mechanicalFile.courtesy_lights = "";
    this.mechanicalFile.upholstery_condition = "";
    this.mechanicalFile.board_lights = "";
    this.mechanicalFile.tire_life = "";
    this.mechanicalFile.battery_status_terminals = "";
    this.mechanicalFile.transmitter_belts = "";
    this.mechanicalFile.motor_oil = "";
    this.mechanicalFile.engine_coolant_container = "";
    this.mechanicalFile.radiator_status = "";
    this.mechanicalFile.exhaust_pipe_bracket = "";
    this.mechanicalFile.distribution_mail = "";
    this.mechanicalFile.fuel_system = "";
    this.mechanicalFile.parking_break = "";
    this.mechanicalFile.brake_bands_drums = "";
    this.mechanicalFile.brake_pads_discs = "";
    this.mechanicalFile.master_cylinder = "";
    this.mechanicalFile.brake_fluid = "";
    this.mechanicalFile.bushings_plateaus = "";
    this.mechanicalFile.stumps = "";
    this.mechanicalFile.terminals = "";
    this.mechanicalFile.stabilizer_bar = "";
    this.mechanicalFile.bearings = "";
    this.mechanicalFile.tripoids_rubbe_bands = "";
    this.mechanicalFile.shock_absorbers_coils = "";
    this.mechanicalFile.dealer_maintenance = "";
    this.mechanicalFile.general_condition = "";
    this.mechanicalFile.odometer = "";
    this.mechanicalFile.engine_start = "";
    this.mechanicalFile.windshields_glass = "";
    this.mechanicalFile.hits_scratches = "";
    this.mechanicalFile.spark_plugs = "";
    this.mechanicalFile.injectors = "";
    this.mechanicalFile.fuel_filter_anti_pollen_filter = "";
    this.mechanicalFile.engine_noises = "";
    this.mechanicalFile.hits_scratches_sides = "";
    this.mechanicalFile.paint_condition_sides = "";
    this.mechanicalFile.trunk_hatch = "";
    this.mechanicalFile.spare_tire = "";
    this.mechanicalFile.hits_scratches_trunk = "";
    this.mechanicalFile.paint_condition_trunk = "";
    this.mechanicalFile.headlights_lights_trunk = "";
    this.mechanicalFile.fuel_tank_cover = "";
    this.mechanicalFile.pipes_hoses_connections = "";
    this.mechanicalFile.brake_discs = "";

  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getMechanicFile();

  }


  public getScrollPos(pos: any) {
    if (pos.detail.scrollTop > this.platform.height()) {
      this.backToTop = true;
    } else {
      this.backToTop = false;
    }
  }

  public goBack() {
    this.route.navigate(['car-detail/' + this.id + '/' + this.theRoute]);
  }

  public getMechanicFile() {
    let data = {
      id_vehicle: this.id
    }
    this.utils.presentLoading("Cargando...");
    this.sellerSrv.mechanicFile(data).subscribe((r: any) => {

      if (r.status) {
        this.loading = false;
        this.mechanicalFile = r.data;
        this.getListReport(this.mechanicalFile);

        this.utils.dismissLoading();

      } else {
        this.utils.dismissLoading();
        this.utils.presentToast(r.message);
      }
    }, error => {
      this.utils.dismissLoading();
      this.utils.presentToast("Error de servidor");
    });
  }

  getListReport(data: any) {
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

  scrollToTop() {
    this.content.scrollToTop(500);
  }

  seeCamposActualizados(item: any) {
    for (let i = 0; i < this.reportes.length; i++) {
      if (this.reportes[i]._id == item._id) {
        this.reportes[i].showcontent = !this.reportes[i].showcontent
        this.reportes[i].show_actualizados_list = !this.reportes[i].show_actualizados_list;
      }
    }
  }

  seeCamposAnteriores(item: any) {
    for (let i = 0; i < this.reportes.length; i++) {
      if (this.reportes[i]._id == item._id) {
        this.reportes[i].showcontent = !this.reportes[i].showcontent
        this.reportes[i].show_anteriores_list = !this.reportes[i].show_anteriores_list;

      }
    }
  }

  async addReport(item: any) {
    const alert = await this.alertController.create({
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
          handler: (data) => {
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
