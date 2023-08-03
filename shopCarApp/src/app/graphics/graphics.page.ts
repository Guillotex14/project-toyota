import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UtilsService } from '../services/utils/utils.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.page.html',
  styleUrls: ['./graphics.page.scss'],
})
export class GraphicsPage implements AfterViewInit {
  @ViewChild('lineCanvas') private lineCanvas!: ElementRef;
  lineChart: any;

  constructor(private router:Router, private menu: MenuController, private utils: UtilsService) {
    Chart.register(...registerables);
   }

  ngAfterViewInit(): void {
    this.lineChartMethod();
  }


  public goBack(){
    this.router.navigate(['seller']);
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
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Noviembre', 'Diciembre'],
        datasets: [
          {
            label: 'Venta por semana',
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
            data: [65, 59, 80, 81, 56, 55, 40, 10, 5, 50, 10, 15],
            spanGaps: false,
          }
        ]
      }
    });
  }

}
