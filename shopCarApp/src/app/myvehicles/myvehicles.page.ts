import { Component, OnInit, ViewChild } from '@angular/core';
import { SellerService } from '../services/seller/seller.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../services/utils/utils.service';
import { IonModal, MenuController } from '@ionic/angular';
import { states } from 'src/assets/json/states';

@Component({
  selector: 'app-myvehicles',
  templateUrl: './myvehicles.page.html',
  styleUrls: ['./myvehicles.page.scss'],
})
export class MyvehiclesPage implements OnInit {
  id: string = "";
  arrayVehicles: any[] = [];

  arrayModels: any[]=[];
  arrayUbication: any[]=[];
  arrayBrands: any[]=[];
  minYear: string = "";
  maxYear: string = "";
  minPrice: string = "";
  maxPrice: string = "";
  minKms: string = "";
  maxKms: string = "";
  brand: string = "";
  model: string = "";
  ubication: string = "";
  type_vehicle: string = "";

  minYearAux: string = "";
  maxYearAux: string = "";
  minPriceAux: string = "";
  maxPriceAux: string = "";
  minKmsAux: string = "";
  maxKmsAux: string = "";
  loading: boolean = true;

  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('modalFilterMyVehicles') modalFilter!: IonModal;
  constructor(private actRoute: ActivatedRoute, private router: Router, private sellerSrv: SellerService, private utils: UtilsService, private menuCtrl: MenuController) {
    this.arrayUbication = states;
    let data = localStorage.getItem('me');

    if(data){
      let json = JSON.parse(data);
      this.id = json.id_sell;
    }
    
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getBrands();
    this.getModels();
    this.getMyVehicles();
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

  public getMyVehicles() {
    let data = {
      brand: this.brand,
      model: this.model,
      ubication: this.ubication,
      type_vehicle: this.type_vehicle,
      minYear: parseInt(this.minYear) > 0 ? parseInt(this.minYear) : 0,
      maxYear: parseInt(this.maxYear) > 0 ? parseInt(this.maxYear) : 0,
      minPrice: parseInt(this.minPrice) > 0 ? parseInt(this.minPrice) : 0,
      maxPrice: parseInt(this.maxPrice) > 0 ? parseInt(this.maxPrice) : 0,
      minKm: parseInt(this.minKms) > 0 ? parseInt(this.minKms) : 0,
      maxKm: parseInt(this.maxKms) > 0 ? parseInt(this.maxKms) : 0,
      id_seller: this.id
    }
  
    this.utils.presentLoading("Cargando...");
    this.sellerSrv.getMyVehicles(data).subscribe((data:any) => {

      if(data.status){
        this.loading = false;
        this.arrayVehicles = data.data;
        this.utils.dismissLoading();
        


      }else{
        this.utils.dismissLoading();
        this.utils.presentToast(data.message);
      }
    },
      (error: any) => {
        console.log(error);
        this.utils.dismissLoading();
        this.utils.presentToast("Error de servidor");
      });
  }

  public goDetail(id_vehicle:any){
    this.router.navigate(['/car-detail/'+id_vehicle+'/myvehicles']);
  }

  public openModal(){
    this.modalFilter.present();
    this.minYear = "";
    this.maxYear = "";
    this.minPrice = "";
    this.maxPrice = "";
    this.minKms = "";
    this.maxKms = "";
    this.brand = "";
    this.model = "";
    this.ubication = "";
    this.type_vehicle = "";
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

  public applyFilter(){
    this.getMyVehicles()
    this.modalFilter.dismiss();
  }

  public dotMinYear(input:any){
    var num = input.value.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      input.value = num;
      this.minYearAux = num;
      this.minYear = input.value.replace(/\./g,'');
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
      this.maxYear = input.value.replace(/\./g,'');
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
      this.minKms = input.value.replace(/\./g,'');
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
      this.maxKms = input.value.replace(/\./g,'');
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
      this.minPrice = input.value.replace(/\./g,'');
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
      this.maxPrice = input.value.replace(/\./g,'');
    }else{ 
      
      input.value = input.value.replace(/[^\d\.]*/g,'');
    }
  }

}
