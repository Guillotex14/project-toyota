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
    return this.http.post(global.urlBase+"mechanic/inspections",id_mechanic, this.authToken);
  }

  public getCountInspections(id_mechanic: any){
    return this.http.post(global.urlBase+"mechanic/countInspections",id_mechanic, this.authToken);
  }

  public getVehicles(data: any){
    return this.http.post(global.urlBase+"mechanic/getVehicles",data,this.authToken);
  }

  public addMechanicalFile(mechanicalFile: any){
    return this.http.post(global.urlBase+"mechanic/addMechanicalFile",mechanicalFile,this.authToken);
  }

  public editFileMechanic(data: any){
    return this.http.post(global.urlBase+"mechanic/updateMechanicalFile",data,this.authToken);
  }

  public rejectMechanicalFile(id_vehicle: any){
    return this.http.post(global.urlBase+"mechanic/rejectMechanicalFile",id_vehicle,this.authToken);
  }

  public getVehicleById(id_vehicle: any){
    return this.http.post(global.urlBase+"mechanic/getVehicleById",id_vehicle,this.authToken);
  }

  public getMechanicalFile(id_vehicle: any){
    return this.http.post(global.urlBase+"mechanic/getMechanicFileByIdVehicle",id_vehicle,this.authToken);
  }

  public getNotifications(data:any){
    return this.http.post(global.urlBase+'mechanic/getNotifications', data, this.authToken);
  }

  public updateNotification(data:any){
    return this.http.post(global.urlBase+'mechanic/updateNotification', data, this.authToken);
  }

  public getCountNotifications(data:any){
    return this.http.post(global.urlBase+'mechanic/countNotifications', data, this.authToken);
  }

  public notificationById(data:any){
    return this.http.post(global.urlBase+'mechanic/notificationById', data, this.authToken);
  }

  public allBrands(){
    return this.http.get(global.urlBase+'mechanic/allBrands', this.authToken);
  }

  public allModels(){
    return this.http.get(global.urlBase+'mechanic/allModels', this.authToken);
  }
}
