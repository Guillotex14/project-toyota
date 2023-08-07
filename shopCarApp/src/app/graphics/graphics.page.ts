import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, MenuController } from '@ionic/angular';
import { UtilsService } from '../services/utils/utils.service';
import { Chart, registerables } from 'chart.js';
import { SellerService } from 'src/app/services/seller/seller.service';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.page.html',
  styleUrls: ['./graphics.page.scss'],
})
export class GraphicsPage implements AfterViewInit, OnInit {
  lineChart: any;
  month: number = 1;
  yearSold: number = new Date().getFullYear();
  rangMonths: number = 12;
  yearCar: string="";
  yearCarAux: string = '';
  brandCar: string = '';
  modelCar: string = '';

  arrayLabels: any[] = [];
  arrayBrands: any[] = [];
  arrayModels: any[] = [];
  genCondCar: any[] = [];
  arrayData: any = {};
  
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('lineCanvas') private lineCanvas!: ElementRef;

  constructor(private router:Router, private menu: MenuController, private utils: UtilsService, private sellerSrv: SellerService) {
    Chart.register(...registerables);

  }
  
  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.getChartGrafic();
    this.getBrands();
    this.getModels();
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

    this.sellerSrv.getGrafic(data).subscribe((res:any)=>{
        if (res.status) {
          console.log(res)
          this.arrayLabels = res.data.labels;
          this.arrayData = res.data.datasets[0];
          this.genCondCar = res.data.mechanicaFiles
          this.lineChartMethod();
          console.log(this.arrayLabels);
          console.log(this.arrayData);

          for (let i = 0; i < this.genCondCar.length; i++) {
            console.log(this.genCondCar[i]._id)
            
          }
        }
    } , (err:any)=>{
      console.log(err);
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

  // public dotMaxYear(input:any){
  //   var num = input.value.replace(/\./g,'');
  //   if(!isNaN(num)){
  //     num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
  //     num = num.split('').reverse().join('').replace(/^[\.]/,'');
  //     input.value = num;
  //     this.maxYearAux = num;
  //     this.maxYear = input.value.replace(/\./g,'');
  //   }else{ 
      
  //     input.value = input.value.replace(/[^\d\.]*/g,'');
  //   }
  // }

}
