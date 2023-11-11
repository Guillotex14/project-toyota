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
  }

  public addSeller(seller: any) {
    return this.http.post(global.urlBase+"user/insert",seller,this.authSrv.getToken()!);
  }

  public allSellers(data:any){
    return this.http.get(global.urlBase+`user/all?s=${data.s}&pos=${data.pos}&lim=${data.lim}&type_user=seller`,this.authSrv.getToken()!);
  }

  public getSellerById(id: any) {
    return this.http.get(global.urlBase+"user/get?id_user="+id.id,this.authSrv.getToken()!);
  }

  public updateSeller(seller: any) {
    return this.http.post(global.urlBase+"user/update",seller,this.authSrv.getToken()!);
  }

  public deleteSeller(id: any) {
    return this.http.post(global.urlBase+"user/delete",id,this.authSrv.getToken()!);
  }

  public addAdmin(data: any) {
    return this.http.post(global.urlBase+"user/insert",data,this.authSrv.getToken()!);
  }

  public allAdminsConcesionary(data:any){
    return this.http.get(global.urlBase+`user/all?s=${data.s}&pos=${data.pos}&lim=${data.lim}&type_user=admin_concesionary`,this.authSrv.getToken()!);
  }

  public getAdminById(id: any) {
    return this.http.get(global.urlBase+"user/get?id_user="+id,this.authSrv.getToken()!);
  }

  public updateAdmin(admin: any) {
    return this.http.post(global.urlBase+"user/update",admin,this.authSrv.getToken()!);
  }

  public deleteAdmin(id: any) {
    return this.http.post(global.urlBase+"user/delete",id,this.authSrv.getToken()!);
  }

  public getVehicles(data: any) {
    return this.http.post(global.urlBase+'vehicle/filterVehiclesWithMongo', data,this.authSrv.getToken()!);
  }

  public getVehicleById(id: any) {
    return this.http.post(global.urlBase+"vehicle/vehicleById",id,this.authSrv.getToken()!);
  }

  public mechanicFile(id:any){
    return this.http.post(global.urlBase+'vehicle/mechanicalFileByIdVehicle',id,this.authSrv.getToken()!);
  }

  public searchSeller(search: any) {
    return this.http.post(global.urlBase+"admin/searchSeller",search,this.authSrv.getToken()!);
  }

  public allModels() {
    return this.http.get(global.urlBase+"vehicle/allModelVehicle?s=",this.authSrv.getToken()!);
  }

  public getModelList(data:any){
    return this.http.get(`${global.urlBase}vehicle/allModelPaginator?s=${data.s}&pos=${data.pos}&lim=${data.lim}`,this.authSrv.getToken()!);
  }

  public addModel(model: any) {
    return this.http.post(global.urlBase+"vehicle/addModelVehicle",model,this.authSrv.getToken()!);
  }

  public updateModel(model: any){
    return this.http.post(global.urlBase+"user/updateModel",model,this.authSrv.getToken()!);
  }

  public deleteModel(model: any){
    return this.http.post(global.urlBase+"user/deleteModel",model,this.authSrv.getToken()!);
  }

  public allMechanics(data:any){
    return this.http.get(global.urlBase+`user/all?s=${data.s}&pos=${data.pos}&lim=${data.lim}&type_user=mechanic`,this.authSrv.getToken()!);
  }

  public getMechanicById(data:any){
    return this.http.get(global.urlBase+"user/get?id_user="+data.id_user,this.authSrv.getToken()!);
  }

  public deleteMechanic(data:any){
    return this.http.post(global.urlBase+"user/delete",data,this.authSrv.getToken()!);
  }

  public updateMechanic(data:any){
    return this.http.post(global.urlBase+"user/update",data,this.authSrv.getToken()!);
  }

  public allBrands() {
    return this.http.get(global.urlBase+"vehicle/all-brands?s=",this.authSrv.getToken()!);
  }

  public addBrand(name: any) {
    return this.http.post(global.urlBase+"vehicle/insert-update-brand",name,this.authSrv.getToken()!);
  }

  public getBrandsList(data:any){
    return this.http.get(`${global.urlBase}vehicle/all-paginator-brands?s=${data.s}&pos=${data.pos}&lim=${data.lim}`,this.authSrv.getToken()!);
  }
  
  public getBrandById(id:any){
    return this.http.get(`${global.urlBase}vehicle/get-brand?id=${id}`,this.authSrv.getToken()!);
  }

  public updateBrand(data:any){
    return this.http.post(global.urlBase+'vehicle/insert-update-brand',data,this.authSrv.getToken()!);
  } 

  public deleteBrand(id:any){
    console.log(id);
    return this.http.post(global.urlBase+'vehicle/delete-brand',id,this.authSrv.getToken()!);
  }

  public allConcesionaries(){
    return this.http.get(global.urlBase+'vehicle/allConcesionaries?s=',this.authSrv.getToken()!);
  }

  public allStates(){
    return this.http.get(global.urlBase+'vehicle/allStates?s=',this.authSrv.getToken()!);
  }

}
