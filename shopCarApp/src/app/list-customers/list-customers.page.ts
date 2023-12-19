import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController, IonInfiniteScroll } from '@ionic/angular';
import { AdminService } from '../services/admin/admin.service';
import { UtilsService } from '../services/utils/utils.service';
import { SellerService } from '../services/seller/seller.service';

@Component({
  selector: 'app-list-customers',
  templateUrl: './list-customers.page.html',
  styleUrls: ['./list-customers.page.scss'],
})
export class ListCustomersPage implements OnInit {

  @ViewChild('infiniteScroll') infiniteScroll!: IonInfiniteScroll;

  customersList: any[] = []
  data: any = {
    s:  "",
    pos: 0,
    lim: 10
  }

  loading: boolean = true;

  constructor(private utils: UtilsService, private menu: MenuController, private router:Router, private sellerSrv: SellerService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.data.pos = 0;
    this.getCustomers();
  }

  public goBack(){
    this.router.navigate(["home-admin"]);
    this.data.pos = 0;
  }

  public openMenu(){
    this.utils.setLogin(true);
    this.menu.open();
  }

  public getCustomers(){
    this.loading = true;
    this.sellerSrv.getCustomers(this.data).subscribe((resp:any)=>{
      if (resp.status) {
        this.customersList = resp.data.rows;
        this.loading = false;
      }
    },(err:any)=>{
      this.loading = false;
    }
    )

  }

  public loadData(eve:any){
    this.data.pos+=1;
    let moreCustomers = []
    this.sellerSrv.getCustomers(this.data).subscribe((resp:any)=>{
      if (resp.status) {
        if (resp.data.rows.length > 0) {

          moreCustomers = resp.data.rows;
          moreCustomers.map((data:any)=>{
            this.customersList.push(data)
          })

        }
      }
    })
    this.infiniteScroll.complete();
  }
}
