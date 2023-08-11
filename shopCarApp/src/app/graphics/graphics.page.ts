import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, MenuController,Platform } from '@ionic/angular';
import { UtilsService } from '../services/utils/utils.service';
import { Chart, registerables } from 'chart.js';
import { SellerService } from 'src/app/services/seller/seller.service';
import * as moment from 'moment';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.page.html',
  styleUrls: ['./graphics.page.scss'],
})
export class GraphicsPage implements AfterViewInit, OnInit {
  today = new Date();
  lineChart: any;
  month: number = 1;
  yearSold: number = new Date().getFullYear();
  rangMonths: number = 12;
  yearCar: string="";
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
    private platform: Platform
    ,
    private router:Router, private menu: MenuController, private utils: UtilsService, private sellerSrv: SellerService) {
    Chart.register(...registerables);
    this.genCondCar = [];

    let data = JSON.parse(localStorage.getItem('me')!);

    if (data) {
      this.id_user = data.id;
    }

  }
  
  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.getChartGrafic();
    this.getBrands();
    this.getModels();
    this.getCarList();
    
  }

  public goBack(){
    this.router.navigate(['seller']);
  }

  public getBrands(){
    this.sellerSrv.allBrands().subscribe((res:any)=>{
      if (res.status) {
        this.arrayBrands = res.data;
      }
    } , (err:any)=>{
      console.log(err);
    });
  }

  public getModels(){
    this.sellerSrv.allModels().subscribe((res:any)=>{
      if (res.status) {
        this.arrayModels = res.data;
      }
    } , (err:any)=>{
      console.log(err);
    });
  }

  public openFile() {
    this.router.navigate(['mechanical-file']);
  }

  public openMenu(){
    this.utils.setLogin(true);
    this.menu.open();
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
          }
        ]
      }

    });
  }

  public getChartGrafic(){
    let data = {
      month: this.month,
      yearSold: this.yearSold,
      rangMonths: this.rangMonths,
      yearCar: this.yearCar,
      brandCar: this.brandCar,
      modelCar: this.modelCar,
    }
    this.utils.presentLoading('Cargando datos');
    this.sellerSrv.getGrafic(data).subscribe((res:any)=>{
        if (res.status) {
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
      this.utils.presentToast('Error de servidor');
    });
  
  }

  public getCarList(){
    
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
      console.log(err);
      this.utils.presentToast('Error de servidor');
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
        (res: any) => {
          this.utils.dismissLoading2();
          if (res.status) {
            this.platform.ready().then(async (d) => {
              if (this.platform.is('mobile')) {
                const directorioDescargas = await Filesystem.getUri({
                  directory: Directory.Documents,
                  path: res.data.fileName,
                });

                const rutaArchivo = directorioDescargas.uri;

                try {
                  await Filesystem.mkdir({
                    path: rutaArchivo, // Ruta de la carpeta donde se guardará el archivo
                    directory: Directory.Documents,
                    recursive: true, // Crea la carpeta de forma recursiva si no existe
                  });

                  await Filesystem.writeFile({
                    path: `${rutaArchivo}/${res.data.fileName}`, // Ruta completa del archivo
                    data: res.data.base64Data, // Contenido del archivo en base64
                    directory: Directory.Documents,
                  });

                  this.utils.presentToast(
                    'Archivo PDF guardado con éxito en esta ruta: ' +
                      rutaArchivo
                  );
                  console.log('Archivo PDF guardado con éxito');
                } catch (error) {
                  this.utils.presentToast(
                    'Error al descargar el archivo: ' + error
                  );
                  console.error('Error al descargar el archivo:', error);
                }
              } else {
                const downloadLink = document.createElement('a');
                downloadLink.href = res.data.base64Data;
                downloadLink.download = res.data.fileName;
                downloadLink.click();
              }
            });
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    });
  }


  public closeModal(){
    this.modal.dismiss();
  }

  public applyFilter(){

    if (this.lineChart) {
      this.lineChart.destroy();
    }

    this.getChartGrafic();
    this.modal.dismiss();
  }

  public openModalVehicle(){
    this.modalVehicle.present();
  }

  public closeModal2(){
    this.modalVehicle.dismiss();
  }

  public applyFilter2(){
    this.getCarList();
    this.modalVehicle.dismiss();
  }

  public dotMinYear(input:any){
    var num = input.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      input.value = num;
      this.yearCarAux = num;
      this.yearCar = input.value.replace(/\./g,'');
    }else{ 
      
      input.value = input.value.replace(/[^\d\.]*/g,'');
    }
  }

  public dotMinYear2(input:any){
    var num = input.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      input.value = num;
      this.yearCarAux2 = num;
      this.yearCar2 = input.value.replace(/\./g,'');
    }else{ 
      
      input.value = input.value.replace(/[^\d\.]*/g,'');
    }
  }

  public detailCar(id:any){
    this.router.navigate(['car-detail/'+id+'/graphics']);
  }

  public onDateFromChange(event:any){
    this.dateFrom = moment(event.detail.value).format('YYYY-MM-DD');
  }

  public onDateToChange(event:any){
    this.dateTo = moment(event.detail.value).format('YYYY-MM-DD');
  }

}
