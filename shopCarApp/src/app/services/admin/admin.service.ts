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

  public allModels() {
    return this.http.get(global.urlBase+"admin/allModels");
  }

  public addModel(model: any) {
    return this.http.post(global.urlBase+"admin/addModelVehicle",model);
  }

  public allMechanics(data:any){
    return this.http.get(global.urlBase+`user/all?s=${data.s}&pos=${data.pos}&lim=${data.lim}&type_user=mechanic`,this.authToken);
  }

  public getMechanicById(data:any){
    return this.http.get(global.urlBase+"user/get?id_user="+data.id_user,this.authToken);
  }

  public deleteMechanic(data:any){
    return this.http.post(global.urlBase+"user/delete",data,this.authToken);
  }

  public updateMechanic(data:any){
    return this.http.post(global.urlBase+"user/update",data,this.authToken);
  }

  public allBrands() {
    return this.http.get(global.urlBase+"admin/allBrands");
  }

  public addBrand(name: any) {
    return this.http.post(global.urlBase+"vehicle/insert-update-brand",name,this.authToken);
  }

  public getBrandsList(data:any){
    return this.http.get(`${global.urlBase}vehicle/all-paginator-brands?s=${data.s}&pos=${data.pos}&lim=${data.lim}`,this.authToken);
  }
  
  public getBrandById(id:any){
    return this.http.get(`${global.urlBase}vehicle/get-brand?id=${id}`,this.authToken);
  }

  public updateBrand(data:any){
    return this.http.post(global.urlBase+'vehicle/insert-update-brand',data,this.authToken);
  } 

  public deleteBrand(id:any){
    console.log(id);
    return this.http.post(global.urlBase+'vehicle/delete-brand',id,this.authToken);
  }


}
