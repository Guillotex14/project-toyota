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
import { concesionaries } from 'src/assets/json/concesionaries';
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
  arrayConcesionary: any[] = []

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
    this.arrayConcesionary = concesionaries;
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
                this.descargarArchivo(res.data.fileName,res.data.base64Data)
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
