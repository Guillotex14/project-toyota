import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as global from '../../../models/global';
import { urlBase } from '../../../models/global';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MechanicService {

  authToken: any = "";

  constructor(private http: HttpClient, private authSrv: AuthService) { 
    this.authToken = this.authSrv.getToken();
  }

  public getInspections(id_mechanic: any){
    return this.http.post(global.urlBase+"vehicle/inspections",id_mechanic, this.authToken);
  }

  public getCountInspections(id_mechanic: any){
    return this.http.post(global.urlBase+"vehicle/countInspections",id_mechanic, this.authToken);
  }

  public getVehicles(data: any){
    return this.http.post(global.urlBase+"mechanic/getVehicles",data,this.authToken);
  }

  public addMechanicalFile(mechanicalFile: any){
    return this.http.post(global.urlBase+"vehicle/addMechanicalFile",mechanicalFile,this.authToken);
  }

  public editFileMechanic(data: any){
    return this.http.post(global.urlBase+"vehicle/updateMechanicalFile",data,this.authToken);
  }

  public rejectMechanicalFile(id_vehicle: any){
    return this.http.post(global.urlBase+"mechanic/rejectMechanicalFile",id_vehicle,this.authToken);
  }

  public getVehicleById(id_vehicle: any){
    return this.http.post(global.urlBase+"vehicle/vehicleById",id_vehicle,this.authToken);
  }

  public getMechanicalFile(id_vehicle: any){
    return this.http.post(global.urlBase+"vehicle/mechanicalFileByIdVehicle",id_vehicle,this.authToken);
  }

  public getNotifications(data:any){
    return this.http.post(global.urlBase+'user/getNotifications', data, this.authToken);
  }

  public updateNotification(data:any){
    return this.http.post(global.urlBase+'user/updateNotification', data, this.authToken);
  }

  public getCountNotifications(data:any){
    return this.http.post(global.urlBase+'user/countNotifications', data, this.authToken);
  }

  public notificationById(data:any){
    return this.http.post(global.urlBase+'user/notificationById', data, this.authToken);
  }

  public allBrands(){
    return this.http.get(global.urlBase+'vehicle/all-brands?s=', this.authToken);
  }

  public allModels(){
    return this.http.get(global.urlBase+'mechanic/allModels', this.authToken);
  }
}
