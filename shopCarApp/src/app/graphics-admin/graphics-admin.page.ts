import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, MenuController, Platform } from '@ionic/angular';
import { UtilsService } from '../services/utils/utils.service';
import { Chart, registerables } from 'chart.js';
import * as moment from 'moment';
import { SellerService } from '../services/seller/seller.service';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Browser } from '@capacitor/browser';
@Component({
  selector: 'app-graphics-admin',
  templateUrl: './graphics-admin.page.html',
  styleUrls: ['./graphics-admin.page.scss'],
})
export class GraphicsAdminPage implements AfterViewInit {
  today = new Date();
  lineChart: any;
  month: number = 1;
  yearSold: number = new Date().getFullYear();
  rangMonths: any = '';
  yearCar: string = '';
  yearCarAux: string = '';
  brandCar: string = '';
  modelCar: string = '';

  //data filter 2
  dateTo: string = '';
  dateFrom: string = '';
  yearCar2: string = '';
  yearCarAux2: string = '';
  brandCar2: string = '';
  modelCar2: string = '';
  concesionary2: string = '';
  id_user: string = '';

  arrayLabels: any[] = [];
  arrayBrands: any[] = [];
  arrayModels: any[] = [];
  genCondCar: any[] = [];
  arrayData: any = {};
  arrayListCars: any[] = [];

  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('ModalFilterVehicle') modalVehicle!: IonModal;
  @ViewChild('lineCanvas') private lineCanvas!: ElementRef;

  constructor(
    private router: Router,
    private menu: MenuController,
    private utils: UtilsService,
    private sellerSrv: SellerService,
    private platform: Platform
  ) {
    Chart.register(...registerables);
    this.genCondCar = [];

    let data = JSON.parse(localStorage.getItem('me')!);

    if (data) {
      this.id_user = data.id;
    }
  }

  ngAfterViewInit(): void {
    this.getChartGrafic();
    this.getBrands();
    this.getModels();
    this.getCarList();
  }

  public goBack() {
    this.router.navigate(['home-admin']);
  }

  public openMenu() {
    this.utils.setLogin(true);
    this.menu.open();
  }

  public getBrands(){
    this.sellerSrv.allBrands().subscribe((res:any)=>{
      if (res.status) {
        this.arrayBrands = res.data;
      }else{
        console.log(res)
        this.utils.presentToast(res.message);
      }
    } , (err:any)=>{
      console.log(err);
      this.utils.presentToast("Error de servidor");
    });
  }

  public getModels() {
    this.sellerSrv.allModels().subscribe(
      (res: any) => {
        if (res.status) {
          this.arrayModels = res.data;
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  public openFile() {
    this.router.navigate(['mechanical-file']);
  }

  public lineChartMethod() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.arrayLabels,
        datasets: [
          {
            label: this.arrayData.label,
            fill: false,
            // lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.arrayData.data,
            spanGaps: false,
          },
        ],
      },
    });
  }

  public getChartGrafic() {
    let data = {
      month: this.month,
      yearSold: this.yearSold,
      rangMonths: this.rangMonths,
      yearCar: this.yearCar,
      brandCar: this.brandCar,
      modelCar: this.modelCar,
      concesionary: this.concesionary2,
    }
    this.utils.presentLoading("Cargando datos...");
    this.sellerSrv.getGrafic(data).subscribe((res:any)=>{
        if (res.status) {
          console.log(res)
          this.utils.dismissLoading();
          this.arrayLabels = res.data.labels;
          this.arrayData = res.data.datasets[0];
          this.lineChartMethod();
        }else{
          this.utils.dismissLoading();
          this.utils.presentToast(res.message);
        }
    } , (err:any)=>{
      console.log(err);
      this.utils.dismissLoading();
      this.utils.presentToast("Error de servidor");
    });
  
  }

  public getCarList(){
    console.log(this.id_user)
    let data = {
      dateTo: this.dateTo,
      dateFrom: this.dateFrom,
      yearCar: this.yearCar2,
      brandCar: this.brandCar2,
      modelCar: this.modelCar2,
      concesionary: this.concesionary2,
      id_user: this.id_user,
    }
    this.sellerSrv.getListCars(data).subscribe((res:any)=>{
      console.log(res)
      if (res.status) {
        if (res.data.grupocard.length > 0) {
          for (let i = 0; i < res.data.grupocard.length; i++) {
            if (res.data.grupocard[i].vehiclesWithImages.length > 0) {
              for (let j = 0; j < res.data.grupocard[i].vehiclesWithImages.length; j++) {
                if (res.data.grupocard[i].vehicles.length > 0){
                  for (let k = 0; k < res.data.grupocard[i].vehicles.length; k++) {
                    if (res.data.grupocard[i].vehiclesWithImages[j].id_vehicle == res.data.grupocard[i].vehicles[k]._id) {
                      res.data.grupocard[i].vehicles[k].image = res.data.grupocard[i].vehiclesWithImages[j].img;
                    }else{
                      res.data.grupocard[i].vehicles[k].image ="";
                    }
                  }
                }else{
                  if (res.data.grupocard[i].vehicles.length > 0){
                    for (let k = 0; k < res.data.grupocard[i].vehicles.length; k++) {
                      res.data.grupocard[i].vehicles[k].image ="";
                    }
                  }
                }
              }
            }else{
              if (res.data.grupocard[i].vehicles.length > 0){
                for (let k = 0; k < res.data.grupocard[i].vehicles.length; k++) {
                  res.data.grupocard[i].vehicles[k].image ="";
                }
              }
            }
          }
        }

        this.arrayListCars = res.data.grupocard;
      }else{
        this.utils.presentToast(res.message);
      }
    }
    , (err:any)=>{
      this.utils.presentToast("Error de servidor");
    });

  }

  public exportExcel() {
    let data = {
      dateTo: this.dateTo,
      dateFrom: this.dateFrom,
      yearCar: this.yearCar2,
      brandCar: this.brandCar2,
      modelCar: this.modelCar2,
      concesionary: this.concesionary2,
      id_user: this.id_user,
    };

    this.utils.showLoading().then((_) => {
      this.sellerSrv.exportExcel(data).subscribe(
       async (res: any) => {
          this.utils.dismissLoading2();
          if (res.status) {
                this.descargarArchivo(res.data.fileName,"data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,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")
            this.utils.presentToast(
              'Se mandado un correo de la exportación del excel ' +res.data.fileName
                
            );
              // this.platform.ready().then(async (d) => {
            //   if (this.platform.is('mobile')) {
            //     const directorioDescargas = await Filesystem.getUri({
            //       directory: Directory.External,
            //       path: res.data.fileName,
            //     });

            //     const rutaArchivo = directorioDescargas.uri;

            //     try {
            //       await Filesystem.mkdir({
            //         path: rutaArchivo, // Ruta de la carpeta donde se guardará el archivo
            //         directory: Directory.External,
            //         recursive: true, // Crea la carpeta de forma recursiva si no existe
            //       });

            //       await Filesystem.writeFile({
            //         path: `${rutaArchivo}/${res.data.fileName}`, // Ruta completa del archivo
            //         data: res.data.base64Data, // Contenido del archivo en base64
            //         directory: Directory.External,
            //       });

            //       this.utils.presentToast(
            //         'Archivo PDF guardado con éxito en esta ruta: ' +
            //           rutaArchivo
            //       );
            //       console.log('Archivo PDF guardado con éxito');
            //     } catch (error) {
            //       this.utils.presentToast(
            //         'Error al descargar el archivo: ' + error
            //       );
            //       console.error('Error al descargar el archivo:', error);
            //     }
            //   } else {
            //     const downloadLink = document.createElement('a');
            //     downloadLink.href = res.data.base64Data;
            //     downloadLink.download = res.data.fileName;
            //     downloadLink.click();
            //   }
            // });


            this.utils.presentToast(
              'Se mandado un correo de la exportación del excel ' +res.data.fileName               
            );
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    });
  }

  async  descargarArchivo(nombreArchivo: string, dataBase64: string): Promise<void> {
    try {
      // Abrir una nueva ventana del navegador con el archivo
      const url=dataBase64;
      await Browser.open({ url });
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    }
  }


  public closeModal() {
    this.modal.dismiss();
  }

  public applyFilter() {
    if (this.lineChart) {
      this.lineChart.destroy();
    }

    this.getChartGrafic();
    this.modal.dismiss();
  }

  public openModalVehicle() {
    this.modalVehicle.present();
  }

  public closeModal2() {
    this.modalVehicle.dismiss();
  }

  public applyFilter2() {
    this.getCarList();
    this.modalVehicle.dismiss();
  }

  public dotMinYear(input: any) {
    var num = input.value.replace(/\./g, '');
    if (!isNaN(num)) {
      num = num
        .toString()
        .split('')
        .reverse()
        .join('')
        .replace(/(?=\d*\.?)(\d{3})/g, '$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/, '');
      input.value = num;
      this.yearCarAux = num;
      this.yearCar = input.value.replace(/\./g, '');
    } else {
      input.value = input.value.replace(/[^\d\.]*/g, '');
    }
  }

  public dotMinYear2(input: any) {
    var num = input.value.replace(/\./g, '');
    if (!isNaN(num)) {
      num = num
        .toString()
        .split('')
        .reverse()
        .join('')
        .replace(/(?=\d*\.?)(\d{3})/g, '$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/, '');
      input.value = num;
      this.yearCarAux2 = num;
      this.yearCar2 = input.value.replace(/\./g, '');
    } else {
      input.value = input.value.replace(/[^\d\.]*/g, '');
    }
  }

  public detailCar(id: any) {
    this.router.navigate(['car-detail-admin/' + id + '/graphics-admin']);
  }

  public onDateFromChange(event: any) {
    this.dateFrom = moment(event.detail.value).format('YYYY-MM-DD');
  }

  public onDateToChange(event: any) {
    this.dateTo = moment(event.detail.value).format('YYYY-MM-DD');
  }
}
