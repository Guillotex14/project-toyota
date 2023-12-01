import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { SellerService } from '../services/seller/seller.service';
import { UtilsService } from '../services/utils/utils.service';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.page.html',
  styleUrls: ['./comparison.page.scss'],
})
export class ComparisonPage implements OnInit {

  comparison: any[] = [];
  loading: boolean = true;
  constructor(private actRoute: ActivatedRoute, private router: Router, private sellerSrv: SellerService, private utils: UtilsService, private menuCtrl: MenuController) { 
    // this.getComparison();
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


    if (this.comparison.length === 1) {
      this.comparison[0].kmColor = '#00A651'
      this.comparison[0].priceColor = '#00A651'
    }

    if (this.comparison.length === 2) {
      //comparamos el kilometraje de los vehiculos de cada vehiculo

      for (let i = 0; i < this.comparison.length; i++) {
        if (this.comparison[0].km < this.comparison[1].km) {
          this.comparison[0].kmColor = '#00A651';
        }else if (this.comparison[0].km === this.comparison[1].km) {
          this.comparison[0].kmColor = '#00A651';
        }else {
          this.comparison[0].kmColor = '#EB0A1E';
        }
  
        if (this.comparison[1].km < this.comparison[0].km) {
          this.comparison[1].kmColor = '#00A651';
          
        }else if (this.comparison[1].km === this.comparison[0].km) {
          this.comparison[1].kmColor = '#00A651';
        }else{
          this.comparison[1].kmColor = '#EB0A1E';
        }
      }
  
      //comparamos el precio de los vehiculos de cada vehiculo
      for (let i = 0; i < this.comparison.length; i++) {
        if (this.comparison[0].price < this.comparison[1].price) {
          this.comparison[0].priceColor = '#00A651';
        }else if (this.comparison[0].price == this.comparison[1].price) {
          this.comparison[0].priceColor = '#00A651';
        }else {
          this.comparison[0].priceColor = '#EB0A1E';
        }
  
        if (this.comparison[1].price < this.comparison[0].price) {
          this.comparison[1].priceColor = '#00A651';
          
        }else if (this.comparison[1].price == this.comparison[0].price) {
          this.comparison[1].priceColor = '#00A651';
        }else{
          this.comparison[1].priceColor = '#EB0A1E';
        }
      }
    }
    
    if (this.comparison.length === 3) {
      //comparamos el kilometraje de los vehiculos de cada vehiculo
      for (let i = 0; i < this.comparison.length; i++) {
        if (this.comparison[0].km < this.comparison[1].km && this.comparison[0].km < this.comparison[2].km) {
          this.comparison[0].kmColor = '#00A651';
        }else if (this.comparison[0].km === this.comparison[1].km && this.comparison[0].km === this.comparison[2].km) {
          this.comparison[0].kmColor = '#00A651';
        }else {
          this.comparison[0].kmColor = '#EB0A1E';
        }
  
        if (this.comparison[1].km < this.comparison[0].km && this.comparison[1].km < this.comparison[2].km) {
          this.comparison[1].kmColor = '#00A651';
          
        }else if (this.comparison[1].km === this.comparison[0].km && this.comparison[1].km === this.comparison[2].km) {
          this.comparison[1].kmColor = '#00A651';
        }else{
          this.comparison[1].kmColor = '#EB0A1E';
        }
  
        if (this.comparison[2].km < this.comparison[0].km && this.comparison[2].km < this.comparison[1].km) {
          this.comparison[2].kmColor = '#00A651';
        }else if (this.comparison[2].km === this.comparison[0].km && this.comparison[2].km === this.comparison[1].km) {
          this.comparison[2].kmColor = '#00A651';
        }else {
        this.comparison[2].kmColor = '#EB0A1E';
        }
      }
  
      //comparamos el precio de los vehiculos de cada vehiculo
      for (let i = 0; i < this.comparison.length; i++) {
        if (this.comparison[0].price < this.comparison[1].price && this.comparison[0].price < this.comparison[2].price) {
          this.comparison[0].priceColor = '#00A651';
        }else if (this.comparison[0].price == this.comparison[1].price && this.comparison[0].price == this.comparison[2].price) {
          this.comparison[0].priceColor = '#00A651';
        }
        else {
          this.comparison[0].priceColor = '#EB0A1E';
        }
      }
    }

    if (this.comparison.length === 4) {
      //comparamos el kilometraje de los vehiculos de cada vehiculo
      for (let i = 0; i < this.comparison.length; i++) {
        if (this.comparison[0].km < this.comparison[1].km && this.comparison[0].km < this.comparison[2].km && this.comparison[0].km < this.comparison[3].km ) {
          this.comparison[0].kmColor = '#00A651';
        }else if (this.comparison[0].km == this.comparison[1].km && this.comparison[0].km == this.comparison[2].km && this.comparison[0].km == this.comparison[3].km ) {
          this.comparison[0].kmColor = '#00A651';
        }else {
          this.comparison[0].kmColor = '#EB0A1E';
        }
  
        if (this.comparison[1].km < this.comparison[0].km && this.comparison[1].km < this.comparison[2].km && this.comparison[1].km < this.comparison[3].km ) {
          this.comparison[1].kmColor = '#00A651';
          
        }else if (this.comparison[1].km == this.comparison[0].km && this.comparison[1].km == this.comparison[2].km && this.comparison[1].km == this.comparison[3].km ) {
          this.comparison[1].kmColor = '#00A651';
        }else{
          this.comparison[1].kmColor = '#EB0A1E';
        }
  
        if (this.comparison[2].km < this.comparison[0].km && this.comparison[2].km < this.comparison[1].km && this.comparison[2].km < this.comparison[3].km ) {
          this.comparison[2].kmColor = '#00A651';
        }else if (this.comparison[2].km == this.comparison[0].km && this.comparison[2].km == this.comparison[1].km && this.comparison[2].km == this.comparison[3].km ) {
          this.comparison[2].kmColor = '#00A651';
        }else {
        this.comparison[2].kmColor = '#EB0A1E';
        }
  
        if (this.comparison[3].km < this.comparison[0].km && this.comparison[3].km < this.comparison[1].km && this.comparison[3].km < this.comparison[2].km ) {
          this.comparison[3].kmColor = '#00A651';
        } else if (this.comparison[3].km == this.comparison[0].km && this.comparison[3].km == this.comparison[1].km && this.comparison[3].km == this.comparison[2].km ) {
          this.comparison[3].kmColor = 'green';
        } else {
          this.comparison[3].kmColor = '#EB0A1E';
        }
      }
  
      //comparamos el precio de los vehiculos de cada vehiculo
      for (let i = 0; i < this.comparison.length; i++) {
        if (this.comparison[0].price < this.comparison[1].price && this.comparison[0].price < this.comparison[2].price && this.comparison[0].price < this.comparison[3].price ) {
          this.comparison[0].priceColor = '#00A651';
        }else if (this.comparison[0].price === this.comparison[1].price && this.comparison[0].price === this.comparison[2].price && this.comparison[0].price === this.comparison[3].price ) {
          this.comparison[0].priceColor = '#00A651';
        }else {
          this.comparison[0].priceColor = '#EB0A1E';
        }
  
        if (this.comparison[1].price < this.comparison[0].price && this.comparison[1].price < this.comparison[2].price && this.comparison[1].price < this.comparison[3].price ) {
          this.comparison[1].priceColor = '#00A651';
          
        }else if (this.comparison[1].price === this.comparison[0].price && this.comparison[1].price === this.comparison[2].price && this.comparison[1].price === this.comparison[3].price ) {
          this.comparison[1].priceColor = '#00A651';
        }else{
          this.comparison[1].priceColor = '#EB0A1E';
        }
  
        if (this.comparison[2].price < this.comparison[0].price && this.comparison[2].price < this.comparison[1].price && this.comparison[2].price < this.comparison[3].price ) {
          this.comparison[2].priceColor = '#00A651';
        }else if (this.comparison[2].price === this.comparison[0].price && this.comparison[2].price === this.comparison[1].price && this.comparison[2].price === this.comparison[3].price ) {
          this.comparison[2].priceColor = '#00A651';
        }else {
        this.comparison[2].priceColor = '#EB0A1E';
        }
  
        if (this.comparison[3].price < this.comparison[0].price && this.comparison[3].price < this.comparison[1].price && this.comparison[3].price < this.comparison[2].price ) {
          this.comparison[3].priceColor = '#00A651';
        }
        else if (this.comparison[3].price === this.comparison[0].price && this.comparison[3].price === this.comparison[1].price && this.comparison[3].price === this.comparison[2].price ) {
          this.comparison[3].priceColor = 'green';
        }
        else {
          this.comparison[3].priceColor = '#EB0A1E';
        } 
      }
    }

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

  public bestKm(){
    let best = 0;
    let second = 0;
    let third = 0;
    let fourth = 0;
    for (let i = 0; i < this.comparison.length; i++) {
      //capta el menor kilometraje
      if (this.comparison[0].km < this.comparison[1].km && this.comparison[0].km < this.comparison[2].km && this.comparison[0].km < this.comparison[3].km ) {
        best = this.comparison[0].km;
      } 
      //capta el segundo menor kilometraje
      if (this.comparison[1].km < this.comparison[0].km && this.comparison[1].km < this.comparison[2].km && this.comparison[1].km < this.comparison[3].km ) {
        second = this.comparison[1].km;
      }

      //capta el tercer menor kilometraje
      if (this.comparison[2].km < this.comparison[0].km && this.comparison[2].km < this.comparison[1].km && this.comparison[2].km < this.comparison[3].km ) {
        third = this.comparison[2].km;
      }

      //capta el cuarto menor kilometraje
      if (this.comparison[3].km < this.comparison[0].km && this.comparison[3].km < this.comparison[1].km && this.comparison[3].km < this.comparison[2].km ) {
        fourth = this.comparison[3].km;
      }
    }
    console.log(best, second, third, fourth);

  }
}
