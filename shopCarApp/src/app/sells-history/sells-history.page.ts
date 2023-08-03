import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UtilsService } from '../services/utils/utils.service';

@Component({
  selector: 'app-sells-history',
  templateUrl: './sells-history.page.html',
  styleUrls: ['./sells-history.page.scss'],
})
export class SellsHistoryPage implements OnInit {

  constructor(private router: Router, private menu: MenuController, private utils: UtilsService) { }

  ngOnInit() {
  }


  public goTo(){
    this.router.navigate(['home-admin']);
  }

  public openMenu() {
    this.utils.setLogin(true);
    this.menu.open();
  }
}
