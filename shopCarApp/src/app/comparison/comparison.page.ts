import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { SellerService } from '../services/seller/seller.service';
import { UtilsService } from '../services/utils/utils.service';
import { comparisonModel } from 'src/models/sellet';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.page.html',
  styleUrls: ['./comparison.page.scss'],
})
export class ComparisonPage implements OnInit {
  
  comparison: any[] = [];
  arrayEqualKm: any[] = [];
  arrayEqualPrice: any[] = [];
  arrayEqualTitle: any[] = [];
  arrayEqualCondition: any[] = [];
  loading: boolean = true;
  constructor(private actRoute: ActivatedRoute, private router: Router, private sellerSrv: SellerService, private utils: UtilsService, private menuCtrl: MenuController) { 
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getComparison();
  }
  
  public openMenu() {
    this.utils.setLogin(true);
    this.menuCtrl.open();
  }

  public goBack() {
    this.router.navigate(['/seller']);
  }
  
  public getComparison() {

    this.comparison = this.utils.getComparasion();

    let colors = ['#00A651', '#F9D616', '#F7941D', '#EB0A1E'];
    let labels = ['firstKm', 'secondKm', 'thirdKm', 'fourthKm', 'equalKM'];
    let labelsPrice = ['firstPrice', 'secondPrice', 'thirdPrice', 'fourthPrice', 'equalPrice'];
    let labelsTitle = ['firstTitle', 'secondTitle', 'thirdTitle', 'fourthTitle', 'equalTitle'];

    this.comparison = this.assignColorsAndLabelsKm('km', colors, labels);
    this.comparison = this.assignColorsAndLabelsPrice('price', colors, labelsPrice);
    this.comparison = this.assignBestTitle('titles', labelsTitle);
    
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  public deleteComparison(id: any) {
    this.utils.deleteComparasion(id);
    this.getComparison();
  }

  public evaluateTitles(data: any) {
    let color = '';
    let title = data.split('-');
    title = title[0];

    if (title == 1) {
      color = '#00A651'
    }

    if (title == 2) {
      color = '#F7941D'
    }

    if (title >= 3) {
      color = '#EB0A1E'
    }
    
    return color;
  }

  public evaluateStatus(status: any) {

    let color = '';

    if (status >= 96) {
      color = '#11D800';
    }

    if (status >= 86 && status < 96) {
      color = '#F9D616';
    }

    if (status >= 76 && status < 86 ) {
      color = '#F7941D';
    }

    if (status < 76) {
      color = '#EB0A1E';
    }

    return color;
  }

  public bestTitles(titles: any){
    let split = titles.split('-');
    let title = split[0];

    if (Number(title) == 1) {
      return 1;
    }

    if (Number(title) == 2) {
      return 2;
    }

    if (Number(title) >= 3) {
      return 3;
    }

    return null;
  }
  
  public assignColorsAndLabelsKm(property: string, colors: string[], labels: string[]) {

    let sortedComparison = [...this.comparison].sort((a, b) => a[property] - b[property]);

    for (let i = 0; i < sortedComparison.length; i++) {
      sortedComparison[i][`${property}Color`] = colors[i];
      sortedComparison[i][labels[i]] = true;
      sortedComparison[i].equalKm = false;
    }

    //relizamos un loop para buscar los vehiculos que tengan el mismo kilometraje y no le asignamos color, solo la propiedad equalKm

    for (let i = 0; i < sortedComparison.length; i++) {
      for (let j = 0; j < sortedComparison.length; j++) {
        if (sortedComparison[i][property] === sortedComparison[j][property] && i !== j) {
          sortedComparison[i].equalKM = true;
          this.arrayEqualKm.push(sortedComparison[i]);
        }
      }
    }
    return sortedComparison;
  }

  public assignColorsAndLabelsPrice(property: string, colors: string[], labels: string[]) {
    let sortedComparison = [...this.comparison].sort((a, b) => a[property] - b[property]);

    for (let i = 0; i < sortedComparison.length; i++) {
      sortedComparison[i][`${property}Color`] = colors[i];
      sortedComparison[i][labels[i]] = true;
      sortedComparison[i].equalPrice = false;
    }

    //relizamos un loop para buscar los vehiculos que tengan el mismo precio y no le asignamos color, solo la propiedad equalPrice

    for (let i = 0; i < sortedComparison.length; i++) {
      for (let j = 0; j < sortedComparison.length; j++) {
        if (sortedComparison[i][property] === sortedComparison[j][property] && i !== j) {
          sortedComparison[i].equalPrice = true;
          this.arrayEqualPrice.push(sortedComparison[i]);
        }
      }
    }


    return sortedComparison;
  }

  public assignBestTitle(property: string, labels: string[]) {

    let typesTitles = [
      '1-1',
      '2-1',
      '3-1',
      '4-1',
      '5-1',
      '6-1',
      '7-1',
      '8-1',
      '9-1',
      '10-1'
    ]
    
    //realizamos un sort para ordenar los titulos de los vehiculos de menor a mayor donde el titulo le realiza un split y se obtiene el primer valor que es el numero de titulos

    let sortedComparison = [...this.comparison].sort((a, b) => Number(a[property].split('-')[0]) - Number(b[property].split('-')[0]));
    for (let i = 0; i < sortedComparison.length; i++) {
      sortedComparison[i][labels[i]] = true;
      sortedComparison[i].equalTitle = false;
    }

    //relizamos un loop para buscar los vehiculos que tengan el mismo titulo y no le asignamos color, solo la propiedad equalTitle

    for (let i = 0; i < sortedComparison.length; i++) {
      for (let j = 0; j < sortedComparison.length; j++) {
        if (sortedComparison[i][property] === sortedComparison[j][property] && i !== j) {
          sortedComparison[i].equalTitle = true;
          this.arrayEqualTitle.push(sortedComparison[i]);
          
          if (sortedComparison[i].firstTitle) {
            sortedComparison[i].firstTitle = false;
          }

          if (sortedComparison[i].secondTitle) {
            sortedComparison[i].secondTitle = false;
          }

          if (sortedComparison[i].thirdTitle) {
            sortedComparison[i].thirdTitle = false;
          }

          if (sortedComparison[i].fourthTitle) {
            sortedComparison[i].fourthTitle = false;
          }

        }
      }
    }

    return sortedComparison;

  }

  public renderIqualTitle() {
    let models = this.arrayEqualTitle.filter((item: any) => {return item.model });
    let content = `
      Los vehículos ${this.arrayEqualTitle.map((item: any) => {return item.model })} tienen la misma cantidad de titulos.
    `

    return content;

   
    
  }

  public renderIqualKm() {
    let models = this.arrayEqualKm.filter((item: any) => {return item.model });
    let content = `
      Los vehículos ${this.arrayEqualKm.map((item: any) => {return item.model })} tienen el mismo kilometraje.
    `

    return content;
  }


  public renderIqualPrice() {
    let models = this.arrayEqualPrice.filter((item: any) => {return item.model });
    let content = `
      Los vehículos ${this.arrayEqualPrice.map((item: any) => {return item.model })} tienen el mismo precio.
    `

    return content;
  }

  public conclution() {

    let models = this.comparison.map((item: any) => {return item.model});

    let bestKm = this.comparison.filter((item: any) => {return item.firstKm === true})[0];

    let bestPrice = this.comparison.filter((item: any) => {return item.firstPrice === true})[0];

    let bestTitle = this.comparison.filter((item: any) => {return item.firstTitle === true})[0]; 

    let bestCondition = this.comparison.sort((a: any, b: any) => {return b.general_condition - a.general_condition})[0];

    let content =`En última instancia, la elección entre los modelos ${models.map((item: any) => {return item})} dependerá de tus prioridades individuales. Si buscas mejor kilometraje, elige el modelo ${bestKm.model}. Para menor cantidad de titulares, el modelo ${bestTitle.model} es la  opción más sólida. si el precio es una prioridad, el modelo ${bestPrice.model} te lo ofrece y para un mejor estado del vehículo, considera el modelo ${bestCondition.model}. Cada vehículo tiene sus propias fortalezas, así que elige aquel que mejor se alinee con tus necesidades y preferencias. `;

    return content;


  }
}
