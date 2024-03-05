import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Info } from '../info'
 
@Injectable({
 providedIn: 'root'
})
export class UploadService {
 
 constructor(
   private httpClient: HttpClient,
 ) { }
 
 public uploadfile(formData: FormData) {
   return this.httpClient.post(`${Info.ServerUrl}/upload`, formData)
 }

 public downloadFile(filename:string){
  const url = `${Info.ServerUrl}/download/${filename}`;
   return this.httpClient.get(url, { responseType: 'blob' })
 }
 
}