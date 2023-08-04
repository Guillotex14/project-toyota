import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as global from '../../../models/global';

@Injectable({
  providedIn: 'root'
})
export class MechanicService {

  constructor(private http: HttpClient) { }

  public getInspections(id_mechanic: any){
    return this.http.post(global.urlBase+"mechanic/inspections",id_mechanic);
  }

  public getCountInspections(id_mechanic: any){
    return this.http.post(global.urlBase+"mechanic/countInspections",id_mechanic);
  }

  public getVehicles(data: any){
    return this.http.post(global.urlBase+"mechanic/getVehicles",data);
  }

  public addMechanicalFile(mechanicalFile: any){
    return this.http.post(global.urlBase+"mechanic/addMechanicalFile",mechanicalFile);
  }

  public rejectMechanicalFile(id_vehicle: any){
    return this.http.post(global.urlBase+"mechanic/rejectMechanicalFile",id_vehicle);
  }

  public getVehicleById(id_vehicle: any){
    return this.http.post(global.urlBase+"mechanic/getVehicleById",id_vehicle);
  }

  public getMechanicalFile(id_vehicle: any){
    return this.http.post(global.urlBase+"mechanic/getMechanicFileByIdVehicle",id_vehicle);
  }

  public getNotifications(data:any){
    return this.http.post(global.urlBase+'mechanic/getNotifications', data);
  }

  public updateNotification(data:any){
    return this.http.post(global.urlBase+'mechanic/updateNotification', data);
  }

  public getCountNotifications(data:any){
    return this.http.post(global.urlBase+'mechanic/countNotifications', data);
  }

  public notificationById(data:any){
    return this.http.post(global.urlBase+'mechanic/notificationById', data);
  }

  public allBrands(){
    return this.http.get(global.urlBase+'mechanic/allBrands');
  }

  public allModels(){
    return this.http.get(global.urlBase+'mechanic/allModels');
  }
}
