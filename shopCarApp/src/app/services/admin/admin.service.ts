import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as global from '../../../models/global';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  authToken:any="";

  constructor(private http: HttpClient, private authSrv: AuthService) {
    this.authToken=this.authSrv.getToken();
  }

  public addSeller(seller: any) {
    return this.http.post(global.urlBase+"user/insert",seller,this.authToken);
  }

  public getSellers() {
    return this.http.get(global.urlBase+"admin/AllSellers");
  }

  public getSellerById(id: any) {
    return this.http.post(global.urlBase+"admin/sellerById",id);
  }

  public updateSeller(seller: any) {
    return this.http.post(global.urlBase+"admin/updateSeller",seller);
  }

  public deleteSeller(id: any) {
    return this.http.post(global.urlBase+"admin/deleteSeller",id);
  }

  public getVehicles(data: any) {
    return this.http.post(global.urlBase+"admin/AllVehicles",data);
  }

  public getVehicleById(id: any) {
    return this.http.post(global.urlBase+"admin/vehicleById",id);
  }

  public mechanicFile(id:any){
    return this.http.post(global.urlBase+'seller/mechanicalFileByIdVehicle',id);
  }

  public searchSeller(search: any) {
    return this.http.post(global.urlBase+"admin/searchSeller",search);
  }

  public addBrand(name: any) {
    return this.http.post(global.urlBase+"admin/addBrand",name);
  }

  public allBrands() {
    return this.http.get(global.urlBase+"admin/allBrands");
  }

  public allModels() {
    return this.http.get(global.urlBase+"admin/allModels");
  }

  public addModel(model: any) {
    return this.http.post(global.urlBase+"admin/addModelVehicle",model);
  }

  public allMechanics(){
    return this.http.get(global.urlBase+"user/allMechanics",this.authToken);
  }

}
