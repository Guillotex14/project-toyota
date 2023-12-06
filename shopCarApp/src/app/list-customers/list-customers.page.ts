import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController, IonInfiniteScroll } from '@ionic/angular';
import { AdminService } from '../services/admin/admin.service';
import { UtilsService } from '../services/utils/utils.service';

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

  constructor(private utils: UtilsService, private adminSrv: AdminService, private menu: MenuController, private router:Router, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.data.pos = 0;
  }

  public goBack(){
    this.router.navigate(["home-admin"]);
    this.data.pos = 0;
  }

  public openMenu(){
    this.utils.setLogin(true);
    this.menu.open();
  }

  public loadData(eve:any){
    this.data.pos+=1;
    let moreMechanics = []
    // this.adminSrv.allMechanics(this.data).subscribe((resp:any)=>{
    //   if (resp.status) {
    //     if (resp.data.rows.length > 0) {

    //       moreMechanics = resp.data.rows;
    //       moreMechanics.map((data:any)=>{
    //         this.mechanicList.push(data)
    //       })

    //     }
    //   }
    // })
    this.infiniteScroll.complete();
  }
}
