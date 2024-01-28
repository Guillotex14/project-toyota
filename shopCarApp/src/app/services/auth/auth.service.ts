import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as global from '../../../models/global';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user:any="";
  authToken:string="";

  constructor(private http:HttpClient, public utils: UtilsService) { 
    this.setToken();
  }

  public saveData(data:any){
    localStorage.setItem('me', JSON.stringify(data));
  }

  public getMeData(){
    let me: any = null;

    if (localStorage.getItem('me')) me = JSON.parse(localStorage.getItem('me')!);

    return me
  }

  public getToken() {
    let headers = {};
    this.user = JSON.parse(localStorage.getItem("me")!);
    if (this.user) {
      headers = new HttpHeaders()
        .set('Authorization', this.user.token)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      return { headers };
    }else{
      return null;
    } 
    
  }

  public login(data:any){
    return this.http.post(global.urlBase+'auth/login', data);
  }

  public addImage(data:any){
    return this.http.post(global.urlBase+'auth/addImgProfile', data);
  }

  public UpdateImage(data:any){
    return this.http.post(global.urlBase+'auth/updateImgProfile', data);
  }

  public setToken(){
    this.utils.getLogin().subscribe((data) => {
      if (data === true) {
        this.getToken();
      }else{
        this.getToken();
      }
    });
  }
}
