import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, MenuController,Platform } from '@ionic/angular';
import { UtilsService } from '../services/utils/utils.service';
import { Chart, registerables } from 'chart.js';
import { SellerService } from 'src/app/services/seller/seller.service';
import * as moment from 'moment';
import { Browser } from '@capacitor/browser';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.page.html',
  styleUrls: ['./graphics.page.scss'],
})
export class GraphicsPage implements AfterViewInit, OnInit {
  me: any = null;
  today = new Date();
  lineChart: any;
  month: any = "";
  yearSold: number = new Date().getFullYear();
  rangMonths: any = '';
  yearCar: string="";
  yearCarAux: string = '';
  brandCar: string = '';
  modelCar: string = '';
  triple_m: string = '';
  concesionary: string = '';

  //data filter 2
  dateTo: string = '';
  dateFrom: string = '';
  yearCar2: string = '';
  yearCarAux2: string = '';
  brandCar2: string = '';
  modelCar2: string = '';
  concesionary2: string = '';
  id_user: string = '';

  //breadcrumb
  brand_breadcrumb: string = "";
  model_breadcrumb: string = "";
  year_breadcrumb: string = "";
  rangMonths_breadcrumb: string = "";
  month_breadcrumb: string = "";
  triple_m_breadcrumb: string = "";

  arrayLabels: any[] = [];
  arrayBrands: any[] = [];
  arrayModels: any[] = [];
  carListGraphic: any[] = [];
  arrayData: any = {};
  arrayListCars: any[] = [];
  dataGraphy: any = {};
  
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('ModalFilterVehicleSeller') modalVehicle!: IonModal;
  @ViewChild('ModalFilterGraphicSeller') modalFilter!: IonModal;
  @ViewChild('lineCanvas') private lineCanvas!: ElementRef;

  constructor(
    private platform: Platform
    ,
    private router:Router, private menu: MenuController, private utils: UtilsService, private sellerSrv: SellerService, private authSrv: AuthService) {
    Chart.register(...registerables);
    
    this.me = this.authSrv.getMeData();

    if (this.me) {
      this.id_user = this.me.id;
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
      data: this.dataGraphy

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
      triple_m: this.triple_m,
      concesionary: this.concesionary,
    }
    this.utils.presentLoading('Cargando datos');
    this.sellerSrv.getGrafic(data).subscribe((res:any)=>{
        if (res.status) {
          this.utils.dismissLoading();
          this.arrayLabels = res.data.labels;
          this.arrayData = res.data.datasets[0];
          this.dataGraphy=res.data;

          let emptyGraphy = 0;
          for (let i = 0; i < this.dataGraphy.datasets[0].data.length; i++) {
            const element = this.dataGraphy.datasets[0].data[i];
            if (element == 0) {
              emptyGraphy++;
            }
  
          }
          if (emptyGraphy == this.dataGraphy.datasets[0].data.length) {
            this.utils.presentAlert("", "Gráfica sin resultado", "");
          }

          if (res.data.list.length > 0) {
            this.carListGraphic = res.data.list;
            
          }

          this.lineChartMethod();
          this.month = 1;
          this.month_breadcrumb = "1";
          this.yearSold = new Date().getFullYear();
          this.rangMonths = "";
          this.yearCar = "";
          this.brandCar = "";
          this.modelCar = "";
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
      if (res.status) {

        this.arrayListCars = res.data.grupocard;
        // this.dateTo = ""
        // this.dateFrom = ""
        // this.yearCar2 = ""
        // this.brandCar2 = ""
        // this.modelCar2 = ""
        // this.concesionary2 = ""
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
            this.descargarArchivo(res.data.fileName,res.data.base64Data)

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

  public openModal(){
    this.modalFilter.present();
    this.month = 1;
    this.yearSold = new Date().getFullYear();
    this.rangMonths = '';
    this.yearCar = '';
    this.yearCarAux = '';
    this.brandCar = '';
    this.modelCar = '';
  }

  public closeModal(){
    this.modalFilter.dismiss();
    
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
    this.dateTo = '';
    this.dateFrom = '';
    this.yearCar2 = '';
    this.yearCarAux2 = '';
    this.brandCar2 = '';
    this.modelCar2 = '';
    this.concesionary2 = '';
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
      this.year_breadcrumb = input.value.replace(/\./g,'');
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

  public setDot(data:any){
    var str = data.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return str.join(".");
  }

  public onChangeBrand(event:any){
    this.brand_breadcrumb = event.detail.value;
  }

  public onChangeModel(event:any){
    this.model_breadcrumb = event.detail.value;
  }

  public onInputYear(event:any){
    this.year_breadcrumb = event.detail.value;
  }

  public onChangeRngMonth(event:any){
    console.log(event.detail.value)
    this.rangMonths_breadcrumb = event.detail.value;
  }

  public onChangeMonth(event:any){
    this.month_breadcrumb = event.detail.value;
  }

  public onChangeTripleM(event:any){
    this.triple_m_breadcrumb = event.detail.value;
  }

}
