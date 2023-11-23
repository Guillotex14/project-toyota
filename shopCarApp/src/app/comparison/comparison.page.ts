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

  constructor(private actRoute: ActivatedRoute, private router: Router, private sellerSrv: SellerService, private utils: UtilsService, private menuCtrl: MenuController) { 
    this.getComparison();
  }

  ngOnInit() {

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
  }

  public deleteComparison(id: any) {
    this.utils.deleteComparasion(id);
    this.getComparison();
  }
}
