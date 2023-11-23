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
    
  }

  public getInspections(id_mechanic: any){
    return this.http.post(global.urlBase+"vehicle/inspections",id_mechanic, this.authSrv.getToken()!);
  }

  public getCountInspections(id_mechanic: any){
    return this.http.post(global.urlBase+"vehicle/countInspections",id_mechanic, this.authSrv.getToken()!);
  }

  public getVehicles(data: any){
    return this.http.post(global.urlBase+"vehicle/myVehicles",data,this.authSrv.getToken()!);
  }

  public addMechanicalFile(mechanicalFile: any){
    return this.http.post(global.urlBase+"vehicle/addMechanicalFile",mechanicalFile,this.authSrv.getToken()!);
  }

  public editFileMechanic(data: any){
    return this.http.post(global.urlBase+"vehicle/updateMechanicalFile",data,this.authSrv.getToken()!);
  }

  public getVehicleById(id_vehicle: any){
    return this.http.post(global.urlBase+"vehicle/vehicleById",id_vehicle,this.authSrv.getToken()!);
  }

  public getMechanicalFile(id_vehicle: any){
    return this.http.post(global.urlBase+"vehicle/mechanicalFileByIdVehicle",id_vehicle,this.authSrv.getToken()!);
  }

  public getNotifications(data:any){
    return this.http.get(`${global.urlBase}user/getNotifications?id_user=${data.id_user}&pos=${data.pos}&lim=${data.lim}`, this.authSrv.getToken()!);
  }

  public updateNotification(data:any){
    return this.http.post(global.urlBase+'user/updateNotification', data, this.authSrv.getToken()!);
  }

  public getCountNotifications(data:any){
    return this.http.post(global.urlBase+'user/countNotifications', data, this.authSrv.getToken()!);
  }

  public notificationById(data:any){
    return this.http.post(global.urlBase+'user/notificationById', data, this.authSrv.getToken()!);
  }

  public allBrands(){
    return this.http.get(global.urlBase+'vehicle/all-brands?s=', this.authSrv.getToken()!);
  }

  public allModels(){
    return this.http.get(global.urlBase+'vehicle/allModelVehicle?s=', this.authSrv.getToken()!);
  }
}
