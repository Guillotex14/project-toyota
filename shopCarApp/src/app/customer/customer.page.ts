import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AdminService } from '../services/admin/admin.service';
import { AuthService } from '../services/auth/auth.service';
import { UtilsService } from '../services/utils/utils.service';
import { CustomerModel } from '../../models/sellet';
import { SellerService } from '../services/seller/seller.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {

  newCustomer: CustomerModel = new CustomerModel();
  me: any = null

  invalidEmail: boolean = false;
  incorrectUser: boolean = false;
  emptyEmail: boolean = false;
  budget: string = "";

  emptyBudget: boolean = false;
  emptyName: boolean = false;
  emptyLastName: boolean = false;
  emptyModel: boolean = false;
  emptyPhone: boolean = false;


  constructor(private router: Router, private menu: MenuController, private utils: UtilsService, private sellerSrv: SellerService, private authSrv: AuthService) { 
    this.me = this.authSrv.getMeData();
    this.newCustomer.email = "";
    this.newCustomer.name = "";
    this.newCustomer.last_name = "";
    this.newCustomer.interested_car_model = "";
    this.newCustomer.phone = ""
    this.newCustomer.approximate_budget = ""
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

  public saveCustomer() {

    if (this.newCustomer.email ==="" || this.newCustomer.email === undefined) {
      this.utils.presentToast("El correo electronico es obligatorio");
      this.emptyEmail = true;
      return;
    }

    if (this.newCustomer.name ==="" || this.newCustomer.name === undefined) {
      this.utils.presentToast("El nombre es obligatorio");
      this.emptyName = true;
      return;
    }

    if (this.newCustomer.last_name ==="" || this.newCustomer.last_name === undefined) {
      this.utils.presentToast("El apellido es obligatorio");
      this.emptyLastName =true; 
      return;
    }

    if (this.newCustomer.interested_car_model ==="" || this.newCustomer.interested_car_model === undefined) {
      this.utils.presentToast("El modelo de carro es obligatorio");
      this.emptyModel = true;
      return;
    }

    if (this.newCustomer.phone ==="" || this.newCustomer.phone === undefined) {
      this.utils.presentToast("El telefono es obligatorio");
      this.emptyPhone = true;
      return;
    }

    if (this.newCustomer.approximate_budget ==="" || this.newCustomer.approximate_budget === undefined) {
      this.utils.presentToast("El presupuesto aproximado es obligatorio");
      this.emptyBudget = true;
      return;
    }
    this.utils.presentLoading("Agregando cliente");
    this.sellerSrv.saveCustomer(this.newCustomer).subscribe((res: any) => {

      if (res.status) {
        this.utils.dismissLoading();
        this.utils.presentToast("Cliente creado con éxito");
        this.newCustomer.email = "";
        this.newCustomer.name = "";
        this.newCustomer.last_name = "";
        this.newCustomer.interested_car_model = "";
        this.newCustomer.phone = ""
        this.newCustomer.approximate_budget = ""
      }else{
        this.utils.dismissLoading();
        this.utils.presentToast("Error al crear el cliente");
      }
    }, err => {
      this.utils.dismissLoading();
      this.utils.presentToast("Error al crear el cliente");
    });
  }

  public validEmail(event:any){
    if (event.detail.value !== '') {
      this.incorrectUser=false;
      this.emptyEmail=false;
      if (!this.utils.validateEmail(event.detail.value)) {
        this.invalidEmail=true;
      }else{
        this.invalidEmail=false;
      }
    }
  }

  public setDotKm(input:any){
    
    var num = input.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      input.value = num;
      this.newCustomer.approximate_budget = num;
    }else{ 
      
      input.value = input.value.replace(/[^\d\.]*/g,'');
    }

  }

  public validateName(e:any){
    
    if (e.target.value != "") {
      this.emptyName = false;
    }

  } 

  public validateLastName(e:any){
    
    if (e.target.value != "") {
      this.emptyLastName = false;
    }

  } 

  public validateModel(e:any){
    
    if (e.target.value != "") {
      this.emptyModel = false;
    }

  }

  public validatePhone(e:any){
    
    if (e.target.value != "") {
      this.emptyPhone = false;
    }

  }

  public validateBudget(e:any){
    
    if (e.target.value != "") {
      this.emptyBudget = false;
    }

  }


}
