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
    return this.http.post(global.urlBase+'seller/addVehicle',data,this.authToken);
  }

  public getAllVehicles(){
    return this.http.get(global.urlBase+'seller/allVehicles',this.authToken);
  }

  public getMyVehicles(id:any){
    return this.http.post(global.urlBase+'seller/myVehicles',id,this.authToken);
  }

  public vehicleById(id:any){
    return this.http.post(global.urlBase+'seller/vehicleById',id,this.authToken);
  }

  public getVehicleByType(data:any){
    return this.http.post(global.urlBase+'seller/getVehicleByType',data,this.authToken);
  }

  public mechanicFile(id:any){
    return this.http.post(global.urlBase+'seller/mechanicalFileByIdVehicle',id,this.authToken);
  }

  public updateVehicle(data:any){
    return this.http.post(global.urlBase+'seller/updateVehicle',data,this.authToken);
  }

  public getMechanics(){
    return this.http.get(global.urlBase+'seller/allMechanics',this.authToken);
  }

  public getMechanicByConcesionary(concesionary:any){
    return this.http.post(global.urlBase+'seller/mechanicByConcesionary',concesionary, this.authToken);
  }

  public getZones(){
    return this.http.get(global.urlBase+'seller/allZones',this.authToken);
  }

  public getConcesionaries(){
    return this.http.get(global.urlBase+'seller/allConcesionaries',this.authToken);
  }

  public allBrands(){
    return this.http.get(global.urlBase+'seller/allBrands',this.authToken);
  }

  public buyVehicle(data:any){
    return this.http.post(global.urlBase+'seller/buyVehicle',data,this.authToken);
  }

  public approveBuyVehicle(data:any){
    return this.http.post(global.urlBase+'seller/approveBuyVehicle',data,this.authToken);
  }

  public rejectBuyVehicle(data:any){
    return this.http.post(global.urlBase+'seller/rejectBuyVehicle',data,this.authToken);
  }

  public getNotifications(data:any){
    return this.http.post(global.urlBase+'seller/getNotifications', data,this.authToken);
  }

  public updateNotification(data:any){
    return this.http.post(global.urlBase+'seller/updateNotification', data,this.authToken);
  }

  public getCountNotifications(data:any){
    return this.http.post(global.urlBase+'seller/countNotifications', data,this.authToken);
  }

  public notificationById(data:any){
    return this.http.post(global.urlBase+'seller/notificationById', data,this.authToken);
  }

  public getListByFilter(data:any){
    return this.http.post(global.urlBase+'seller/filterVehiclesWithMongo', data,this.authToken);
  }

  public addImageVehicle(data:any){
    return this.http.post(global.urlBase+'seller/addImgVehicle', data,this.authToken);
  }

  public editImageVehicle(data:any){
    return this.http.post(global.urlBase+'seller/updateImgVehicle', data,this.authToken);
  }
  
  public deleteImageVehicle(data:any){
    return this.http.post(global.urlBase+'seller/deleteImgVehicle', data,this.authToken);
  }

  public allModels(){
    return this.http.get(global.urlBase+'seller/allModels',this.authToken);
  }

  public autoComplete(data:any){
    return this.http.post(global.urlBase+'seller/autocompleteModels', data,this.authToken);
  }

  public dispatched(data:any){
    return this.http.post(global.urlBase+'seller/dispatchedCar', data,this.authToken);
  }

  public repost(data:any){
    return this.http.post(global.urlBase+'seller/repost', data,this.authToken);
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

  
}
