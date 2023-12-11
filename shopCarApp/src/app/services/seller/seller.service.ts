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
    
  }

  public addMechanic(data:any){
    return this.http.post(global.urlBase+'user/insert',data,this.authSrv.getToken()!);
  }

  public addVehicle(data:any){
    return this.http.post(global.urlBase+'vehicle/addVehicle',data,this.authSrv.getToken()!);
  }

  public getMyVehicles(id:any){
    return this.http.post(global.urlBase+'vehicle/myVehicles',id,this.authSrv.getToken()!);
  }

  public vehicleById(id:any){
    return this.http.post(global.urlBase+'vehicle/vehicleById',id,this.authSrv.getToken()!);
  }

  public mechanicFile(id:any){
    return this.http.post(global.urlBase+'vehicle/mechanicalFileByIdVehicle',id,this.authSrv.getToken()!);
  }

  public updateVehicle(data:any){
    return this.http.post(global.urlBase+'vehicle/updateVehicle',data,this.authSrv.getToken()!);
  }

  public getMechanicByConcesionary(concesionary:any){
    return this.http.post(global.urlBase+'seller/mechanicByConcesionary',concesionary, this.authSrv.getToken()!);
  }

  public allBrands(){
    return this.http.get(global.urlBase+'vehicle/all-brands?s=',this.authSrv.getToken()!);
  }

  public buyVehicle(data:any){
    return this.http.post(global.urlBase+'sale/buyVehicle',data,this.authSrv.getToken()!);
  }

  public approveBuyVehicle(data:any){
    return this.http.post(global.urlBase+'sale/approveBuyVehicle',data,this.authSrv.getToken()!);
  }

  public rejectBuyVehicle(data:any){
    return this.http.post(global.urlBase+'sale/rejectBuyVehicle',data,this.authSrv.getToken()!);
  }

  public getNotifications(data:any){
    return this.http.get(`${global.urlBase}user/getNotifications?id_user=${data.id_user}&pos=${data.pos}&lim=${data.lim}`, this.authSrv.getToken()!);
  }

  public updateNotification(data:any){
    return this.http.post(global.urlBase+'user/updateNotification', data,this.authSrv.getToken()!);
  }

  public getCountNotifications(data:any){
    return this.http.post(global.urlBase+'user/countNotifications', data,this.authSrv.getToken()!);
  }

  public notificationById(data:any){
    return this.http.post(global.urlBase+'user/notificationById', data,this.authSrv.getToken()!);
  }

  public getListByFilter(data:any){
    return this.http.post(global.urlBase+'vehicle/filterVehiclesWithMongo', data,this.authSrv.getToken()!);
  }

  public addImageVehicle(data:any){
    return this.http.post(global.urlBase+'vehicle/addImgVehicle', data,this.authSrv.getToken()!);
  }

  public editImageVehicle(data:any){
    return this.http.post(global.urlBase+'vehicle/updateImgVehicle', data,this.authSrv.getToken()!);
  }
  
  public deleteImageVehicle(data:any){
    return this.http.post(global.urlBase+'vehicle/deleteImgVehicle', data,this.authSrv.getToken()!);
  }

  public addImgDoc(data:any){
    return this.http.post(global.urlBase+'vehicle/addImgDocuments', data,this.authSrv.getToken()!);
  }

  public deleteImgDoc(data:any){
    return this.http.post(global.urlBase+'vehicle/deleteImgDocuments', data,this.authSrv.getToken()!);
  }

  public editImgDoc(data:any){
    return this.http.post(global.urlBase+'vehicle/updateImgDocuments', data,this.authSrv.getToken()!);
  }

  public allModels(){
    return this.http.get(global.urlBase+'vehicle/allModelVehicle?s=',this.authSrv.getToken()!);
  }

  public allConcesionaries(){
    return this.http.get(global.urlBase+'vehicle/allConcesionaries',this.authSrv.getToken()!);
  }

  public allStates(){
    return this.http.get(global.urlBase+'vehicle/allStates',this.authSrv.getToken()!);
  }

  public autoComplete(data:any){
    return this.http.post(global.urlBase+'vehicle/autocompleteModels', data,this.authSrv.getToken()!);
  }

  public dispatched(data:any){
    return this.http.post(global.urlBase+'vehicle/dispatchedCar', data,this.authSrv.getToken()!);
  }

  public repost(data:any){
    return this.http.post(global.urlBase+'vehicle/repost', data,this.authSrv.getToken()!);
  }

  public generatePdf(data:any){
    return this.http.get(`${global.urlBase}vehicle/generatePdf?id=${data.id}`,this.authSrv.getToken()!);
  }

  public getGrafic(data:any){
    return this.http.get(`${global.urlBase}vehicle/filterGraphySale?month=${data.month}&yearSold=${data.yearSold}&brandCar=${data.brandCar}&modelCar=${data.modelCar}&yearCar=${data.yearCar}&concesionary=${data.concesionary}&rangMonths=${data.rangMonths}&triple_m=${data.triple_m}`,this.authSrv.getToken()!);
  }

  public getListCars(data:any){
    return this.http.get(`${global.urlBase}vehicle/listVehiclesSale?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}&yearCar=${data.yearCar}&brandCar=${data.brandCar}&modelCar=${data.modelCar}&concesionary=${data.concesionary}&id_user=${data.id_user}`,this.authSrv.getToken()!);
  }

  public exportExcel(data:any){
    return this.http.get(`${global.urlBase}vehicle/exportExcell?dateFrom=${data.dateFrom}&dateTo=${data.dateTo}&yearCar=${data.yearCar}&brandCar=${data.brandCar}&modelCar=${data.modelCar}&concesionary=${data.concesionary}&id_user=${data.id_user}`,this.authSrv.getToken()!);
  }

  public ofertInfo(data:any){
    return this.http.get(`${global.urlBase}vehicle/ofertInfo?id=${data}`,this.authSrv.getToken()!);
  }

  public myOfferts(data:any){
    return this.http.get(`${global.urlBase}vehicle/myOfferts?s=${data.s}&brand=${data.brand}&model=${data.model}&minYear=${data.minYear}&maxYear=${data.maxYear}&minPrice=${data.minPrice}&maxPrice=${data.maxPrice}&minKm=${data.minKm}&maxKm=${data.maxKm}&lim=${data.lim}&pos=${data.pos}`,this.authSrv.getToken()!);
  }
  
  public saveCustomer(data:any){
    return this.http.post(global.urlBase+'client/add', data,this.authSrv.getToken()!);
  }
}
