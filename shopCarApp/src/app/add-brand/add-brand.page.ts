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
    this.menu.open();
  }

  public goBack() {
    this.router.navigate(['home-admin']);
  }

  public addBrand() {

    let data= {
      name: this.brandName,
    }

    if (this.brandName == '') {
      this.utils.presentToast('Debe ingresar el nombre de la marca');
      return;
    }

    this.adminSrv.addBrand(data).subscribe((res:any) => {
      
      if (res.success) {
        this.utils.presentToast('Marca agregada correctamente');
        this.router.navigate(['home-admin']);
        this.brandName = '';
      }else{
        this.utils.presentToast(res.error.message);
      }
    
    }, (err:any) => {
      this.utils.presentToast(err.error.message);
    });
  }
}
