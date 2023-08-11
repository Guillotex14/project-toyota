import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {register} from 'swiper/element/bundle';
import { UtilsService } from '../services/utils/utils.service';
import { MenuController } from '@ionic/angular';
import { MechanicService } from '../services/mechanic/mechanic.service';
import { CarDetailMechanic } from 'src/models/mechanic';
import * as global from '../../models/global';

register();
@Component({
  selector: 'app-car-detail-mechanic',
  templateUrl: './car-detail-mechanic.page.html',
  styleUrls: ['./car-detail-mechanic.page.scss'],
})
export class CarDetailMechanicPage implements OnInit {
  id_vehicle = {
    id: ""
  };

  theRoute: string = "";
  urlImg: string = global.urlImgvehicles;
  carDetail: CarDetailMechanic = new CarDetailMechanic();

  constructor(private router:Router, private utils:UtilsService, private menu: MenuController, private mechanicSrv: MechanicService, private actRouter: ActivatedRoute) {

    this.id_vehicle.id = this.actRouter.snapshot.params['id'];
    this.theRoute = this.actRouter.snapshot.params['route'];

    this.carDetail.id_mechanic = "";
    this.carDetail.id_seller = "";
    this.carDetail.model = "";
    this.carDetail.brand = "";
    this.carDetail.year = 0;
    this.carDetail.displacement = "";
    this.carDetail.km = 0;
    this.carDetail.engine_model = "";
    this.carDetail.titles = "";
    this.carDetail.fuel = "";
    this.carDetail.transmission = "";
    this.carDetail.traction = "";
    this.carDetail.city = "";
    this.carDetail.dealer = "";
    this.carDetail.concesionary = "";
    this.carDetail.traction_control = "";
    this.carDetail.performance = "";
    this.carDetail.price = 0;
    this.carDetail.comfort = "";
    this.carDetail.technology = "";
    this.carDetail.mechanicalFile = false;
    this.carDetail.sold = false;
    this.carDetail.vin = "";
    this.carDetail.vehicle_plate = "";
    this.carDetail.images = [];
    
    // this.getVehicleById();

  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getVehicleById();
  }

  goBack(){
    if(this.theRoute == "home-mechanic"){
      this.router.navigate(['mechanic']);
    }else
    if(this.theRoute == "inspections"){
      this.router.navigate(['inspections']);
    }
  }

  public openFile() {
    this.router.navigate(['add-mechanic-file/'+this.id_vehicle.id+'/'+this.theRoute]);
  }

  public openMenu(){
    this.utils.setLogin(true);
    this.menu.open();
  }

  public getVehicleById(){
    this.utils.presentLoading("Cargando");
    this.mechanicSrv.getVehicleById(this.id_vehicle).subscribe(
      (res: any) => {
        if(res.status){
          console.log(res.data)
          this.carDetail = res.data
          this.utils.dismissLoading();
        }else{
          this.utils.dismissLoading();
          this.utils.presentToast("Error al cargar el vehículo");
        }
      },
      (err) => {
        console.log(err);
        this.utils.dismissLoading();
        this.utils.presentToast("Error al cargar el vehículo");
      }
    );
  }

  public mechanicalFileDetail(){
    this.router.navigate(['mechanical-file-detail-mechanic/'+this.id_vehicle.id+'/'+this.theRoute]);
  }

  public setDot(numb:any){
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return str.join(".");
  }
}
