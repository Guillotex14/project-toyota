import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, MenuController } from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { SellerService } from '../services/seller/seller.service';
import { UtilsService } from '../services/utils/utils.service';

@Component({
  selector: 'app-my-offerts',
  templateUrl: './my-offerts.page.html',
  styleUrls: ['./my-offerts.page.scss'],
})
export class MyOffertsPage implements OnInit {

  id: string = "";
  arrayOfferts: any[] = [];

  arrayModels: any[]=[];
  arrayUbication: any[]=[];
  arrayBrands: any[]=[];

  minYearAux: string = "";
  maxYearAux: string = "";
  minPriceAux: string = "";
  maxPriceAux: string = "";
  minKmsAux: string = "";
  maxKmsAux: string = "";
  
  loading: boolean = true;

  me: any = {};

  search:any = {
    s: "",
    brand: "",
    model: "",
    minYear: "",
    maxYear: "",
    minPrice: "",
    maxPrice: "",
    minKm: "",
    maxKm: "",
    pos: 0,
    lim: 10,
  }

  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('modalFilterMyVehicles') modalFilter!: IonModal;

  constructor(private router: Router, private sellerSrv: SellerService, private utils: UtilsService, private menuCtrl: MenuController,private authSrv: AuthService) { 
    this.me = this.authSrv.getMeData();
    this.id = this.me.id_sell;
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getMyOfferts();
    this.getBrands();
    this.getModels();
  }

  public openMenu() {
    this.utils.setLogin(true);
    this.menuCtrl.open();
  }

  public getBrands(){
    this.sellerSrv.allBrands().subscribe((res: any) => {
      this.arrayBrands = res.data;

    }, (err: any) => {
      console.log(err);
    });
  }

  public getModels(){
    this.sellerSrv.allModels().subscribe((res: any) => {

      if(res.status){
        this.arrayModels = res.data;
      } 

    }, (err: any) => {
      console.log(err);
    });
  }

  public goBack() {
    this.router.navigate(['/seller']);
  }

  public goDetail(id_vehicle:any){
    this.router.navigate(['/car-detail/'+id_vehicle+'/my-offerts']);
  }

  public getMyOfferts() {
    this.loading = true;
    this.utils.presentLoading("Cargando...");
    this.sellerSrv.myOfferts(this.search).subscribe((res: any) => {
      if (res.status) {
        
        this.utils.dismissLoading();
        this.arrayOfferts = res.data.rows;

        setTimeout(() => {
          this.loading = false;
        }, 2000);
      }

    }, (err: any) => {
      console.log(err);
    });
  }

  public applyFilter(){
    this.getMyOfferts()
    this.modalFilter.dismiss();
  }
  

  public openModal(){
    this.modalFilter.present();
    this.search.minYear = "";
    this.search.maxYear = "";
    this.search.minPrice = "";
    this.search.maxPrice = "";
    this.search.minKm = "";
    this.search.maxKm = "";
    this.search.brand = "";
    this.search.model = "";
    this.minYearAux = "";
    this.maxYearAux = "";
    this.minPriceAux = "";
    this.maxPriceAux = "";
    this.minKmsAux = "";
    this.maxKmsAux = "";
  }

  public dismissModal(){
    this.modalFilter.dismiss();
  }

  public dotMinYear(input:any){
    var num = input.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      input.value = num;
      this.minYearAux = num;
      this.search.minYear = input.value.replace(/\./g,'');
    }else{ 
      
      input.value = input.value.replace(/[^\d\.]*/g,'');
    }
  }

  public dotMaxYear(input:any){
    var num = input.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      input.value = num;
      this.maxYearAux = num;
      this.search.maxYear = input.value.replace(/\./g,'');
    }else{ 
      
      input.value = input.value.replace(/[^\d\.]*/g,'');
    }
  }

  public dotMinKm(input:any){
    var num = input.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      input.value = num;
      this.minKmsAux = num;
      this.search.minKm = input.value.replace(/\./g,'');
    }else{ 
      
      input.value = input.value.replace(/[^\d\.]*/g,'');
    }
  }

  public dotMaxKm(input:any){
    var num = input.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      input.value = num;
      this.maxKmsAux = num;
      this.search.maxKm = input.value.replace(/\./g,'');
    }else{ 
      
      input.value = input.value.replace(/[^\d\.]*/g,'');
    }
  }

  public dotMinPrice(input:any){
    var num = input.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      input.value = num;
      this.minPriceAux = num;
      this.search.minPrice = input.value.replace(/\./g,'');
    }else{ 
      
      input.value = input.value.replace(/[^\d\.]*/g,'');
    }
  }

  public dotMaxPrice(input:any){
    var num = input.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      input.value = num;
      this.maxPriceAux = num;
      this.search.maxPrice = input.value.replace(/\./g,'');
    }else{ 
      
      input.value = input.value.replace(/[^\d\.]*/g,'');
    }
  }

}
