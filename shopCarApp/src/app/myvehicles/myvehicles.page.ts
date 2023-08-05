import { Component, OnInit } from '@angular/core';
import { SellerService } from '../services/seller/seller.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../services/utils/utils.service';

@Component({
  selector: 'app-myvehicles',
  templateUrl: './myvehicles.page.html',
  styleUrls: ['./myvehicles.page.scss'],
})
export class MyvehiclesPage implements OnInit {
  id: string = "";
  arrayVehicles: any[] = [];
  
  constructor(private actRoute: ActivatedRoute, private router: Router, private sellerSrv: SellerService, private utils: UtilsService) {
    
    let data = localStorage.getItem('me');

    if(data){
      let json = JSON.parse(data);
      this.id = json.id_sell;
    }
    
    this.getMyVehicles();
  }

  ngOnInit() {
  }

public openMenu() {

}

  public goBack() {
    this.router.navigate(['/seller']);
  }

  public getMyVehicles() {
    let data = {
      id_seller: this.id
    }
    this.utils.presentLoading("Cargando...");
    this.sellerSrv.getMyVehicles(data).subscribe((data:any) => {

      if(data.status){
        console.log(data);
        this.arrayVehicles = data.data;
        this.utils.dismissLoading();

      }else{
        this.utils.presentToast(data.message);
      }
    });
  }

  public goDetail(id_vehicle:any){
    this.router.navigate(['/car-detail/'+id_vehicle+'/myvehicles']);
  }

}
