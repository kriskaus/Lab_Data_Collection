import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import  {Info}  from '../info';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _isAuthenticated: boolean = false;

  constructor( private http: HttpClient) { }

public registerUser(email: string, username: string, password: string,) {
    return this.http.post(`${Info.ServerUrl}/register`,{ username, password, email });
}

public loginUser(username: string, password: string) {
  this._isAuthenticated = true;
  return this.http.post(`${Info.ServerUrl}/login`, { username, password });

}

public logoutUser() {
  this._isAuthenticated = false;
  return this.http.get(`${Info.ServerUrl}/logout`);
}

public isAuthenticated() {
  return this._isAuthenticated;
}

}
