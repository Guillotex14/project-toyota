import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform, IonContent, AlertController } from '@ionic/angular';
import { UtilsService } from '../services/utils/utils.service';
import { SellerService } from '../services/seller/seller.service';
import { CarDetailMechanicalFile } from 'src/models/sellet';
import { Browser } from '@capacitor/browser';

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
    // this.mechanicalFile.id_vehicle = this.id;
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

  public scrollToTop() {
    this.content.scrollToTop(500);
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

  public generatePdf() {
    this.utils.presentLoading("Generando PDF...");
    this.sellerSrv.generatePdfMechanical(this.id).subscribe((r: any) => {
      if (r.status) {
        this.utils.dismissLoading();
        this.utils.presentToast("PDF generado");

        this.openPdf(r.data);
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

  public async openPdf(url: string) {
    await Browser.open({ url: url });
  }

}
