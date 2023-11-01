import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as global from '../../../models/global'
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  authToken:any="";
  constructor(private http:HttpClient, private authSrv: AuthService) { 
    this.authToken=this.authSrv.getToken();
  }

  public addMechanic(data:any){
    return this.http.post(global.urlBase+'user/insert',data,this.authToken);
  }

  public addVehicle(data:any){
    return this.http.post(global.urlBase+'vehicle/addVehicle',data,this.authToken);
  }

  public getMyVehicles(id:any){
    return this.http.post(global.urlBase+'vehicle/myVehicles',id,this.authToken);
  }

  public vehicleById(id:any){
    return this.http.post(global.urlBase+'vehicle/vehicleById',id,this.authToken);
  }

  public mechanicFile(id:any){
    return this.http.post(global.urlBase+'vehicle/mechanicalFileByIdVehicle',id,this.authToken);
  }

  public updateVehicle(data:any){
    return this.http.post(global.urlBase+'vehicle/updateVehicle',data,this.authToken);
  }

  public getMechanicByConcesionary(concesionary:any){
    return this.http.post(global.urlBase+'seller/mechanicByConcesionary',concesionary, this.authToken);
  }

  public allBrands(){
    return this.http.get(global.urlBase+'vehicle/all-brands?s=',this.authToken);
  }

  public buyVehicle(data:any){
    return this.http.post(global.urlBase+'sale/buyVehicle',data,this.authToken);
  }

  public approveBuyVehicle(data:any){
    return this.http.post(global.urlBase+'sale/approveBuyVehicle',data,this.authToken);
  }

  public rejectBuyVehicle(data:any){
    return this.http.post(global.urlBase+'sale/rejectBuyVehicle',data,this.authToken);
  }

  public getNotifications(data:any){
    return this.http.get(`${global.urlBase}user/getNotifications?id_user=${data.id_user}&pos=${data.pos}&lim=${data.lim}`, this.authToken);
  }

  public updateNotification(data:any){
    return this.http.post(global.urlBase+'user/updateNotification', data,this.authToken);
  }

  public getCountNotifications(data:any){
    return this.http.post(global.urlBase+'user/countNotifications', data,this.authToken);
  }

  public notificationById(data:any){
    return this.http.post(global.urlBase+'user/notificationById', data,this.authToken);
  }

  public getListByFilter(data:any){
    return this.http.post(global.urlBase+'vehicle/filterVehiclesWithMongo', data,this.authToken);
  }

  public addImageVehicle(data:any){
    return this.http.post(global.urlBase+'vehicle/addImgVehicle', data,this.authToken);
  }

  public editImageVehicle(data:any){
    return this.http.post(global.urlBase+'vehicle/updateImgVehicle', data,this.authToken);
  }
  
  public deleteImageVehicle(data:any){
    return this.http.post(global.urlBase+'vehicle/deleteImgVehicle', data,this.authToken);
  }

  public addImgDoc(data:any){
    return this.http.post(global.urlBase+'vehicle/addImgDocuments', data,this.authToken);
  }

  public deleteImgDoc(data:any){
    return this.http.post(global.urlBase+'vehicle/deleteImgDocuments', data,this.authToken);
  }

  public editImgDoc(data:any){
    return this.http.post(global.urlBase+'vehicle/updateImgDocuments', data,this.authToken);
  }

  public allModels(){
    return this.http.get(global.urlBase+'vehicle/allModelVehicle',this.authToken);
  }

  public autoComplete(data:any){
    return this.http.post(global.urlBase+'vehicle/autocompleteModels', data,this.authToken);
  }

  public dispatched(data:any){
    return this.http.post(global.urlBase+'vehicle/dispatchedCar', data,this.authToken);
  }

  public repost(data:any){
    return this.http.post(global.urlBase+'vehicle/repost', data,this.authToken);
  }

  public getGrafic(data:any){
    return this.http.get(`${global.urlBase}vehicle/filterGraphySale?month=${data.month}&yearSold=${data.yearSold}&brandCar=${data.brandCar}&modelCar=${data.modelCar}&yearCar=${data.yearCar}&concesionary=${data.concesionary}&rangMonths=${data.rangMonths}&triple_m=${data.triple_m}`,this.authToken);
  }

  public getListCars(data:any){
    return this.http.get(`${global.urlBase}seller/listVehiclesSell?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}&yearCar=${data.yearCar}&brandCar=${data.brandCar}&modelCar=${data.modelCar}&concesionary=${data.concesionary}&id_user=${data.id_user}`,this.authToken);
  }

  public exportExcel(data:any){
    return this.http.get(`${global.urlBase}vehicle/exportExcell?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}&yearCar=${data.yearCar}&brandCar=${data.brandCar}&modelCar=${data.modelCar}&concesionary=${data.concesionary}&id_user=${data.id_user}`,this.authToken);
  }

  public ofertInfo(data:any){
    return this.http.get(`${global.urlBase}vehicle/ofertInfo?id=${data}`,this.authToken);
  }
  
}
