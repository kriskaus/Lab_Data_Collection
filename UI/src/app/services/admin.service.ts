import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Info } from '../info';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private Http: HttpClient) { }

  public FindUser(username: string) {
    return this.Http.get(`${Info.ServerUrl}/users`, { params: { username } });
  }

  // public AddUser(username: string, password: string, email: string) {
  //   return this.Http.post(`${Info.ServerUrl}/users`, { username, password, email });
  // }

  public DeleteUser(username: string) {
    return this.Http.delete(`${Info.ServerUrl}/users/${username}`);
  }

  public UpdateUser(username: string, password: string, email: string) {
    return this.Http.put(`${Info.ServerUrl}/users/${username}`, { username, password, email });
  }


}
