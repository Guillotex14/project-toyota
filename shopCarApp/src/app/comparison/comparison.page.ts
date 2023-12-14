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
    let labels = ['firstKm', 'secondKm', 'thirdKm', 'fourthKm'];
    let labelsPrice = ['firstPrice', 'secondPrice', 'thirdPrice', 'fourthPrice'];
    let labelsTitle = ['firstTitle', 'secondTitle', 'thirdTitle', 'fourthTitle'];

    this.comparison = this.assignColorsAndLabels('km', colors, labels);
    this.comparison = this.assignColorsAndLabels('price', colors, labelsPrice);
    this.comparison = this.assignBestTitle('titles', labelsTitle);
    // if (this.comparison.length === 1) {
    //   this.comparison[0].kmColor = '#00A651'
    //   this.comparison[0].priceColor = '#00A651'
    //   this.comparison[0].firstKm = true;
    //   this.comparison[0].firstPrice = true;
    // }

    // if (this.comparison.length === 2) {
    //   //comparamos el kilometraje de los vehiculos de cada vehiculo

    //   for (let i = 0; i < this.comparison.length; i++) {

    //     if (this.comparison[0].km < this.comparison[1].km) {
    //       this.comparison[0].kmColor = '#00A651';
    //       this.comparison[0].firstKm = true;
    //     }else if (this.comparison[0].km === this.comparison[1].km) {
    //       this.comparison[0].kmColor = '#00A651';
    //       this.comparison[0].iqualKm = true;
    //     }else {
    //       this.comparison[0].kmColor = '#EB0A1E';
    //       this.comparison[0].secondKm = true;
    //     }
  
    //     if (this.comparison[1].km < this.comparison[0].km) {
    //       this.comparison[1].kmColor = '#00A651';
    //       this.comparison[1].firstKm = true;
    //     }else if (this.comparison[1].km === this.comparison[0].km) {
    //       this.comparison[1].kmColor = '#00A651';
    //       this.comparison[1].iqualKm = true;
    //     }else{
    //       this.comparison[1].kmColor = '#EB0A1E';
    //       this.comparison[1].secondKm = true;
    //     }
    //   }
  
    //   //comparamos el precio de los vehiculos de cada vehiculo
    //   for (let i = 0; i < this.comparison.length; i++) {
    //     if (this.comparison[0].price < this.comparison[1].price) {
    //       this.comparison[0].priceColor = '#00A651';
    //       this.comparison[0].firstPrice = true;
    //     }else if (this.comparison[0].price === this.comparison[1].price) {
    //       this.comparison[0].priceColor = '#00A651';
    //       this.comparison[0].iqualPrice = true;
    //     }else {
    //       this.comparison[0].priceColor = '#EB0A1E';
    //       this.comparison[0].secondPrice = true;
    //     }
  
    //     if (this.comparison[1].price < this.comparison[0].price) {
    //       this.comparison[1].priceColor = '#00A651';
    //       this.comparison[1].firstPrice = true;
    //     }else if (this.comparison[1].price === this.comparison[0].price) {
    //       this.comparison[1].priceColor = '#00A651';
    //       this.comparison[1].iqualPrice = true;
    //     }else{
    //       this.comparison[1].priceColor = '#EB0A1E';
    //       this.comparison[1].secondPrice = true;
    //     }
    //   }
    // }
    
    // if (this.comparison.length === 3) {
    //   //comparamos el kilometraje de los vehiculos de cada vehiculo

    //   for (let i = 0; i < this.comparison.length; i++) {

    //     if (this.comparison[0].km < this.comparison[1].km && this.comparison[0].km < this.comparison[2].km) {
    //       this.comparison[0].kmColor = '#00A651';
    //       this.comparison[0].firstKm = true;
    //     }else if (this.comparison[0].km === this.comparison[1].km || this.comparison[0].km === this.comparison[2].km) {
    //       this.comparison[0].kmColor = '#00A651';
    //       this.comparison[0].iqualKm = true;
    //     }else if (this.comparison[0].km > this.comparison[1].km && this.comparison[0].km < this.comparison[2].km) {
    //       this.comparison[0].kmColor = '#F7941D';
    //       this.comparison[0].secondKm = true;
    //     } else {
    //       this.comparison[0].kmColor = '#EB0A1E';
    //       this.comparison[0].thirdKm = true;
    //     }
        
  
    //     if (this.comparison[1].km < this.comparison[0].km && this.comparison[1].km < this.comparison[2].km) {
    //       this.comparison[1].kmColor = '#00A651';
    //       this.comparison[1].firstKm = true;
    //     }else if (this.comparison[1].km === this.comparison[0].km || this.comparison[1].km === this.comparison[2].km) {
    //       this.comparison[1].kmColor = '#00A651';
    //       this.comparison[1].iqualKm = true;
    //     }else if (this.comparison[1].km > this.comparison[0].km && this.comparison[1].km < this.comparison[2].km) {
    //       this.comparison[1].kmColor = '#F7941D';
    //       this.comparison[1].secondKm = true;
    //     } else {
    //       this.comparison[1].kmColor = '#EB0A1E';
    //       this.comparison[1].thirdKm = true;
    //     }
  
    //     if (this.comparison[2].km < this.comparison[0].km && this.comparison[2].km < this.comparison[1].km) {
    //       this.comparison[2].kmColor = '#00A651';
    //       this.comparison[2].firstKm = true;
    //     }else if (this.comparison[2].km === this.comparison[0].km || this.comparison[2].km === this.comparison[1].km) {
    //       this.comparison[2].kmColor = '#00A651';
    //       this.comparison[2].iqualKm = true;
    //     } else if (this.comparison[2].km > this.comparison[0].km && this.comparison[2].km < this.comparison[1].km) {
    //       this.comparison[2].kmColor = '#F7941D';
    //       this.comparison[2].secondKm = true;
    //     } else {
    //       this.comparison[2].kmColor = '#EB0A1E';
    //       this.comparison[2].thirdKm = true;
    //     }


    //     if (this.comparison[0].price < this.comparison[1].price && this.comparison[0].price < this.comparison[2].price) {
    //       this.comparison[0].priceColor = '#00A651';
    //       this.comparison[0].firstPrice = true;
    //     }
    //     else if (this.comparison[0].price === this.comparison[1].price || this.comparison[0].price === this.comparison[2].price) {
    //       this.comparison[0].priceColor = '#00A651';
    //       this.comparison[0].iqualPrice = true;
    //     } else if (this.comparison[0].price > this.comparison[1].price && this.comparison[0].price < this.comparison[2].price) {
    //       this.comparison[0].priceColor = '#F7941D';
    //       this.comparison[0].secondPrice = true;
    //     } else {
    //       this.comparison[0].priceColor = '#EB0A1E';
    //       this.comparison[0].thirdPrice = true;
    //     }

    //     if (this.comparison[1].price < this.comparison[0].price && this.comparison[1].price < this.comparison[2].price) {
    //       this.comparison[1].priceColor = '#00A651';
    //       this.comparison[1].firstPrice = true;
    //     } else if (this.comparison[1].price === this.comparison[0].price || this.comparison[1].price === this.comparison[2].price) {
    //       this.comparison[1].priceColor = '#00A651';
    //       this.comparison[1].iqualPrice = true;
    //     } else if (this.comparison[1].price > this.comparison[0].price && this.comparison[1].price < this.comparison[2].price) {
    //       this.comparison[1].priceColor = '#F7941D';
    //       this.comparison[1].secondPrice = true;
    //     } else {
    //       this.comparison[1].priceColor = '#EB0A1E';
    //       this.comparison[1].thirdPrice = true;
    //     }

    //     if (this.comparison[2].price < this.comparison[0].price && this.comparison[2].price < this.comparison[1].price) {
    //       this.comparison[2].priceColor = '#00A651';
    //       this.comparison[2].firstPrice = true;
    //     } else if (this.comparison[2].price === this.comparison[0].price || this.comparison[2].price === this.comparison[1].price) {
    //       this.comparison[2].priceColor = '#00A651';
    //       this.comparison[2].iqualPrice = true;
    //     } else if (this.comparison[2].price > this.comparison[0].price && this.comparison[2].price < this.comparison[1].price) {
    //       this.comparison[2].priceColor = '#F7941D';
    //       this.comparison[2].secondPrice = true;
    //     } else  {
    //       this.comparison[2].priceColor = '#EB0A1E';
    //       this.comparison[2].thirdPrice = true;
    //     }


    //   }
  
    // }

    // if (this.comparison.length === 4) {

    //   //comparamos el kilometraje de los vehiculos de cada vehiculo
    //   for (let i = 0; i < this.comparison.length; i++) {

    //     if (this.comparison[0].km < this.comparison[1].km && this.comparison[0].km < this.comparison[2].km && this.comparison[0].km < this.comparison[3].km ) {
    //       this.comparison[0].kmColor = '#00A651';
    //       this.comparison[0].firstKm = true;
    //     }else if (this.comparison[0].km === this.comparison[1].km && this.comparison[0].km === this.comparison[2].km && this.comparison[0].km === this.comparison[3].km ) {
    //       this.comparison[0].kmColor = '#00A651';
    //       this.comparison[0].iqualKm = true;
    //     } else if (this.comparison[0].km > this.comparison[1].km && this.comparison[0].km < this.comparison[2].km && this.comparison[0].km < this.comparison[3].km ) {
    //       this.comparison[0].kmColor = '#F9D616';
    //       this.comparison[0].secondKm = true;
    //     } else if (this.comparison[0].km > this.comparison[1].km && this.comparison[0].km > this.comparison[2].km && this.comparison[0].km < this.comparison[3].km ) {
    //       this.comparison[0].kmColor = '#F7941D';
    //       this.comparison[0].thirdKm = true;
    //     } else if (this.comparison[0].km > this.comparison[1].km && this.comparison[0].km > this.comparison[2].km && this.comparison[0].km > this.comparison[3].km ){
    //       this.comparison[0].kmColor = '#EB0A1E';
    //       this.comparison[0].fourthKm = true;
    //     }
  
    //     if (this.comparison[1].km < this.comparison[0].km && this.comparison[1].km < this.comparison[2].km && this.comparison[1].km < this.comparison[3].km ) {
    //       this.comparison[1].kmColor = '#00A651';
    //       this.comparison[1].firstKm = true;
    //     }else if (this.comparison[1].km === this.comparison[0].km && this.comparison[1].km === this.comparison[2].km && this.comparison[1].km === this.comparison[3].km ) {
    //       this.comparison[1].kmColor = '#00A651';
    //       this.comparison[1].iqualKm = true;
    //     }else if (this.comparison[1].km > this.comparison[0].km && this.comparison[1].km < this.comparison[2].km && this.comparison[1].km < this.comparison[3].km ) {
    //       this.comparison[1].kmColor = '#F9D616';
    //       this.comparison[1].secondKm = true;
    //     } else if (this.comparison[1].km > this.comparison[0].km && this.comparison[1].km > this.comparison[2].km && this.comparison[1].km < this.comparison[3].km ) {
    //       this.comparison[1].kmColor = '#F7941D';
    //       this.comparison[1].thirdKm = true;
    //     } else if (this.comparison[1].km > this.comparison[0].km && this.comparison[1].km > this.comparison[2].km && this.comparison[1].km > this.comparison[3].km ) {
    //       this.comparison[1].kmColor = '#EB0A1E';
    //     }
  
    //     if (this.comparison[2].km < this.comparison[0].km && this.comparison[2].km < this.comparison[1].km && this.comparison[2].km < this.comparison[3].km ) {
    //       this.comparison[2].kmColor = '#00A651';
    //       this.comparison[2].firstKm = true;
    //     }else if (this.comparison[2].km === this.comparison[0].km && this.comparison[2].km === this.comparison[1].km && this.comparison[2].km === this.comparison[3].km ) {
    //       this.comparison[2].kmColor = '#00A651';
    //       this.comparison[2].iqualKm = true;
    //     }else if (this.comparison[2].km > this.comparison[0].km && this.comparison[2].km < this.comparison[1].km && this.comparison[2].km < this.comparison[3].km ) {
    //       this.comparison[2].kmColor = '#F9D616';
    //       this.comparison[2].secondKm = true;
    //     } else if (this.comparison[2].km > this.comparison[0].km && this.comparison[2].km > this.comparison[1].km && this.comparison[2].km < this.comparison[3].km ) {
    //       this.comparison[2].kmColor = '#F7941D';
    //       this.comparison[2].thirdKm = true;
    //     } else  if (this.comparison[2].km > this.comparison[0].km && this.comparison[2].km > this.comparison[1].km && this.comparison[2].km > this.comparison[3].km ) {
    //       this.comparison[2].kmColor = '#EB0A1E';
    //       this.comparison[2].fourthKm = true;
    //     }
  
    //     if (this.comparison[3].km < this.comparison[0].km && this.comparison[3].km < this.comparison[1].km && this.comparison[3].km < this.comparison[2].km ) {
    //       this.comparison[3].kmColor = '#00A651';
    //       this.comparison[3].firstKm = true;
    //     } else if (this.comparison[3].km === this.comparison[0].km && this.comparison[3].km === this.comparison[1].km && this.comparison[3].km === this.comparison[2].km ) {
    //       this.comparison[3].kmColor = '#00A651';
    //       this.comparison[3].iqualKm = true;
    //     } else if (this.comparison[3].km > this.comparison[0].km && this.comparison[3].km < this.comparison[1].km && this.comparison[3].km < this.comparison[2].km ) {
    //       this.comparison[3].kmColor = '#F9D616';
    //       this.comparison[3].secondKm = true;
    //     } else if (this.comparison[3].km > this.comparison[0].km && this.comparison[3].km > this.comparison[1].km && this.comparison[3].km < this.comparison[2].km ) {
    //       this.comparison[3].kmColor = '#F7941D';
    //       this.comparison[3].thirdKm = true;
    //     } else if (this.comparison[3].km > this.comparison[0].km && this.comparison[3].km > this.comparison[1].km && this.comparison[3].km > this.comparison[2].km ) {
    //       this.comparison[3].kmColor = '#EB0A1E';
    //       this.comparison[3].fourthKm = true;
    //     }
    //   }
  
    //   //comparamos el precio de los vehiculos de cada vehiculo
    //   for (let i = 0; i < this.comparison.length; i++) {
    //     if (this.comparison[0].price < this.comparison[1].price && this.comparison[0].price < this.comparison[2].price && this.comparison[0].price < this.comparison[3].price ) {
    //       this.comparison[0].priceColor = '#00A651';
    //       this.comparison[0].firstPrice = true;
    //     }else if (this.comparison[0].price === this.comparison[1].price || this.comparison[0].price === this.comparison[2].price || this.comparison[0].price === this.comparison[3].price ) {
    //       this.comparison[0].priceColor = '#00A651';
    //       this.comparison[0].iqualPrice = true;
    //     } else if (this.comparison[0].price > this.comparison[1].price && this.comparison[0].price < this.comparison[2].price && this.comparison[0].price < this.comparison[3].price ) {
    //       this.comparison[0].priceColor = '#F9D616';
    //       this.comparison[0].secondPrice = true;
    //     } else if (this.comparison[0].price > this.comparison[1].price && this.comparison[0].price > this.comparison[2].price && this.comparison[0].price < this.comparison[3].price ) {
    //       this.comparison[0].priceColor = '#F7941D';
    //       this.comparison[0].thirdPrice = true;
    //     } else if (this.comparison[0].price > this.comparison[1].price && this.comparison[0].price > this.comparison[2].price && this.comparison[0].price > this.comparison[3].price ){
    //       this.comparison[0].priceColor = '#EB0A1E';
    //       this.comparison[0].fourthPrice = true;
    //     }
  
    //     if (this.comparison[1].price < this.comparison[0].price && this.comparison[1].price < this.comparison[2].price && this.comparison[1].price < this.comparison[3].price ) {
    //       this.comparison[1].priceColor = '#00A651';
    //       this.comparison[1].firstPrice = true;
    //     }else if (this.comparison[1].price === this.comparison[0].price || this.comparison[1].price === this.comparison[2].price || this.comparison[1].price === this.comparison[3].price ) {
    //       this.comparison[1].priceColor = '#00A651';
    //       this.comparison[1].iqualPrice = true;
    //     } else if (this.comparison[1].price > this.comparison[0].price && this.comparison[1].price < this.comparison[2].price && this.comparison[1].price < this.comparison[3].price ) {
    //       this.comparison[1].priceColor = '#F9D616';
    //       this.comparison[1].secondPrice = true;
    //     } else if (this.comparison[1].price > this.comparison[0].price && this.comparison[1].price > this.comparison[2].price && this.comparison[1].price < this.comparison[3].price ) {
    //       this.comparison[1].priceColor = '#F7941D';
    //       this.comparison[1].thirdPrice = true;
    //     } else if (this.comparison[1].price > this.comparison[0].price && this.comparison[1].price > this.comparison[2].price && this.comparison[1].price > this.comparison[3].price ) {
    //       this.comparison[1].priceColor = '#EB0A1E';
    //       this.comparison[1].fourthPrice = true;
    //     }
  
    //     if (this.comparison[2].price < this.comparison[0].price && this.comparison[2].price < this.comparison[1].price && this.comparison[2].price < this.comparison[3].price ) {
    //       this.comparison[2].priceColor = '#00A651';
    //       this.comparison[2].firstPrice = true;
    //     }else if (this.comparison[2].price === this.comparison[0].price || this.comparison[2].price === this.comparison[1].price || this.comparison[2].price === this.comparison[3].price ) {
    //       this.comparison[2].priceColor = '#00A651';
    //       this.comparison[2].iqualPrice = true;
    //     } else if (this.comparison[2].price > this.comparison[0].price && this.comparison[2].price < this.comparison[1].price && this.comparison[2].price < this.comparison[3].price ) {
    //       this.comparison[2].priceColor = '#F9D616';
    //       this.comparison[2].secondPrice = true;
    //     } else if (this.comparison[2].price > this.comparison[0].price && this.comparison[2].price > this.comparison[1].price && this.comparison[2].price < this.comparison[3].price ) {
    //       this.comparison[2].priceColor = '#F7941D';
    //       this.comparison[2].thirdPrice = true;
    //     } else if (this.comparison[2].price > this.comparison[0].price && this.comparison[2].price > this.comparison[1].price && this.comparison[2].price > this.comparison[3].price ) {
    //       this.comparison[2].priceColor = '#EB0A1E';
    //       this.comparison[2].fourthPrice = true;
    //     }
  
    //     if (this.comparison[3].price < this.comparison[0].price && this.comparison[3].price < this.comparison[1].price && this.comparison[3].price < this.comparison[2].price ) {
    //       this.comparison[3].priceColor = '#00A651';
    //       this.comparison[3].firstPrice = true;
    //     }
    //     else if (this.comparison[3].price === this.comparison[0].price || this.comparison[3].price === this.comparison[1].price || this.comparison[3].price === this.comparison[2].price ) {
    //       this.comparison[3].priceColor = '#00A651';
    //       this.comparison[3].iqualPrice = true;
    //     } else if (this.comparison[3].price > this.comparison[0].price && this.comparison[3].price < this.comparison[1].price && this.comparison[3].price < this.comparison[2].price ) {
    //       this.comparison[3].priceColor = '#F9D616';
    //       this.comparison[3].secondPrice = true;
    //     } else if (this.comparison[3].price > this.comparison[0].price && this.comparison[3].price > this.comparison[1].price && this.comparison[3].price < this.comparison[2].price ) {
    //       this.comparison[3].priceColor = '#F7941D';
    //       this.comparison[3].thirdPrice = true;
    //     } else  if (this.comparison[3].price > this.comparison[0].price && this.comparison[3].price > this.comparison[1].price && this.comparison[3].price > this.comparison[2].price ) {
    //       this.comparison[3].priceColor = '#EB0A1E';
    //       this.comparison[3].fourthPrice = true;
    //     } 
    //   }
    // }

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
  
  public assignColorsAndLabels(property: string, colors: string[], labels: string[]) {
    let sortedComparison = [...this.comparison].sort((a, b) => a[property] - b[property]);
    for (let i = 0; i < sortedComparison.length; i++) {
      sortedComparison[i][`${property}Color`] = colors[i];
      sortedComparison[i][labels[i]] = true;
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

    let sortedComparison = [...this.comparison].sort((a, b) => typesTitles.indexOf(a[property]) - typesTitles.indexOf(b[property]));
    for (let i = 0; i < sortedComparison.length; i++) {
      sortedComparison[i][labels[i]] = true;
    }

    return sortedComparison;

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
