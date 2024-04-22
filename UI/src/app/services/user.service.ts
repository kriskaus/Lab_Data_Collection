import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import  {Info}  from '../info';
import { Observable, catchError, throwError, map, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  static isAuthenticated() {
    throw new Error('Method not implemented.');
  }
  private _isAuthenticated!: boolean;

  constructor( private http: HttpClient) { }

public registerUser(email: string, username: string, password: string, role:string) {
    return this.http.post(`${Info.ServerUrl}/register`,{ username, password, email, role });
}

public loginUser(username: string, password: string) {
  this._isAuthenticated = true;
  console.log(username,password)

  return this.getIPAddress().pipe(
    catchError(error => {
      console.error('Error fetching IP address:', error);
      // If there's an error, return a dummy IP address
      return of(null);
    }),
       switchMap(IPAddress => 
      {console.log(IPAddress)
        return this.http.post(`${Info.ServerUrl}/login`, { username, password, IPAddress })}
    )
  );

}

public logoutUser() {
  this._isAuthenticated = false;
  sessionStorage.setItem('isLogin', "false");
  return this.http.get(`${Info.ServerUrl}/logout`);
}

public isAuthenticated() {
  return this._isAuthenticated;
}

private getIPAddress(): Observable<string> {
  return this.http.get('https://api.ipify.org?format=json').pipe(
    map((data: any) => data.ip)
  );
}

public getUserRole(username: string) {
  return this.http.get(`${Info.ServerUrl}/users/role/${username}`);
}

public uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return this.http.post(`${Info.ServerUrl}/users/csv`, formData);
}

}
