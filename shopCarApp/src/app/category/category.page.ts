import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  constructor(private menu:MenuController, private router:Router) { }

  ngOnInit() {
  }

  public openMenu(){
    this.menu.open();
  }

  public goTo(route:string){
    this.router.navigate(['buy-car/'+route]);
  }

  public goBack(){
    this.router.navigate(['seller']);
  }

}
