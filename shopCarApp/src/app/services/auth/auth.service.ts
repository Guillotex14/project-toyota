import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as global from '../../../models/global';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  public saveData(data:any){
    localStorage.setItem('me', JSON.stringify(data));
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

}
