import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AdminService } from '../services/admin/admin.service';
import { AuthService } from '../services/auth/auth.service';
import { UtilsService } from '../services/utils/utils.service';
import { CustomerModel } from '../../models/sellet';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {

  newCustomer: CustomerModel = new CustomerModel();
  me: any = null

  constructor(private router: Router, private menu: MenuController, private utils: UtilsService, private adminSrv: AdminService, private authSrv: AuthService) { 
    this.me = this.authSrv.getMeData();
    this.newCustomer.name = "";
    this.newCustomer.lastname = "";
    this.newCustomer.email = "";
    this.newCustomer.phone = "";
    this.newCustomer.model = ""
    this.newCustomer.quote = ""
  }

  ngOnInit() {
  }

  public openMenu() {
    this.utils.setLogin(true);
    this.menu.open();
  }

  public goTo() {
    this.utils.setLogin(true);
    this.router.navigate(['home-admin']);
  }
}
