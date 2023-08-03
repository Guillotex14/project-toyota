import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as global from '../../../models/global'

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  constructor(private http:HttpClient) { }

  public addMechanic(data:any){
    return this.http.post(global.urlBase+'seller/addMechanic',data);
  }

  public addVehicle(data:any){
    return this.http.post(global.urlBase+'seller/addVehicle',data);
  }

  public getAllVehicles(){
    return this.http.get(global.urlBase+'seller/allVehicles');
  }

  public getMyVehicles(id:any){
    return this.http.post(global.urlBase+'seller/myVehicles',id);
  }

  public vehicleById(id:any){
    return this.http.post(global.urlBase+'seller/vehicleById',id);
  }

  public getVehicleByType(data:any){
    return this.http.post(global.urlBase+'seller/getVehicleByType',data);
  }

  public mechanicFile(id:any){
    return this.http.post(global.urlBase+'seller/mechanicalFileByIdVehicle',id);
  }

  public updateVehicle(data:any){
    return this.http.post(global.urlBase+'seller/updateVehicle',data);
  }

  public getMechanics(){
    return this.http.get(global.urlBase+'seller/allMechanics');
  }

  public getMechanicByConcesionary(concesionary:any){
    return this.http.post(global.urlBase+'seller/mechanicByConcesionary',concesionary);
  }

  public getZones(){
    return this.http.get(global.urlBase+'seller/allZones');
  }

  public getConcesionaries(){
    return this.http.get(global.urlBase+'seller/allConcesionaries');
  }

  public allBrands(){
    return this.http.get(global.urlBase+'seller/allBrands');
  }

  public buyVehicle(data:any){
    return this.http.post(global.urlBase+'seller/buyVehicle',data);
  }

  public approveBuyVehicle(data:any){
    return this.http.post(global.urlBase+'seller/approveBuyVehicle',data);
  }

  public rejectBuyVehicle(data:any){
    return this.http.post(global.urlBase+'seller/rejectBuyVehicle',data);
  }

  public getNotifications(data:any){
    return this.http.post(global.urlBase+'seller/getNotifications', data);
  }

  public updateNotification(data:any){
    return this.http.post(global.urlBase+'seller/updateNotification', data);
  }

  public getCountNotifications(data:any){
    return this.http.post(global.urlBase+'seller/countNotifications', data);
  }

  public notificationById(data:any){
    return this.http.post(global.urlBase+'seller/notificationById', data);
  }

  public getListByFilter(data:any){
    return this.http.post(global.urlBase+'seller/filterVehiclesWithMongo', data);
  }

  public addImageVehicle(data:any){
    return this.http.post(global.urlBase+'seller/addImgVehicle', data);
  }

  public editImageVehicle(data:any){
    return this.http.post(global.urlBase+'seller/updateImgVehicle', data);
  }
  

  public deleteImageVehicle(data:any){
    return this.http.post(global.urlBase+'seller/deleteImgVehicle', data);
  }

  public autoComplete(data:any){
    return this.http.post(global.urlBase+'seller/autocompleteModels', data);
  }
}
