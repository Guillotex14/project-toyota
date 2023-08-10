import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AdminService } from '../services/admin/admin.service';
import { UtilsService } from '../services/utils/utils.service';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.page.html',
  styleUrls: ['./add-brand.page.scss'],
})
export class AddBrandPage implements OnInit {

  brandName: string = '';
  constructor(private menu: MenuController, private router:Router, private adminSrv:AdminService, private utils:UtilsService) { }

  ngOnInit() {
  }

  public openMenu() {
    this.utils.setLogin(true);
    this.menu.open();
  }

  public goBack() {
    this.router.navigate(['home-admin']);
  }

  public addBrand() {
    this.utils.presentLoading('Agregando marca');
    let data= {
      name: this.brandName,
    }

    if (this.brandName == '') {
      this.utils.presentToast('Debe ingresar el nombre de la marca');
      this.utils.dismissLoading();
      return;
    }

    this.adminSrv.addBrand(data).subscribe((res:any) => {
      
      if (res.status) {
        this.utils.dismissLoading();
        this.utils.presentToast('Marca agregada correctamente');
        this.router.navigate(['home-admin']);
        this.brandName = '';
      }else{
        this.utils.dismissLoading();
        this.utils.presentToast(res.message);
      }
    
    }, (err:any) => {
      this.utils.dismissLoading();
      this.utils.presentToast(err.message);
    });
  }
}
