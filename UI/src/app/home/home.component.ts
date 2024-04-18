import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UploadService } from '../services/upload.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { MessageService } from 'primeng/api';
import { FileUploadEvent } from 'primeng/fileupload';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MessageService]
})
export class HomeComponent {
  selectedFile: File | null = null;
  public showFile: File | null = null;
  uploadedFiles: any[] = [];
  files: any[] = [];

  constructor(private http: HttpClient, private uploadService: UploadService, private userService: UserService, private router: Router,
    private messageService: MessageService) {}

  ngOnInit(): void {
      this.getAllFiles();
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  public uploadFile() {
    if (!this.selectedFile) {
      return;
    }

    const formData = new FormData();
    // formData.append('file', this.selectedFile, this.selectedFile.name);
    formData.append('file', this.selectedFile, this.selectedFile.name);
    this.uploadService.uploadfile(formData).subscribe({
      next: () => {
        this.getAllFiles();
        console.log('file uploaded successfully');
        this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
       
      },
      error: (err) => {
        console.error('Failed to upload file', err);
      },
    });
  }

  public downloadFile(filename: string | undefined) {
    if (!filename) {
      return;
    }
    this.uploadService.downloadFile(filename).subscribe({
      next: (data) => {
        // const downloadURL = window.URL.createObjectURL(data);
        // const link = document.createElement('a');
        // link.href = downloadURL;
        // link.download = filename;
        saveAs(data, filename);
      },
      error: (err) => {

        console.error('Failed to download file', err);
      },
    });
  }

 public logout() {
  this.userService.logoutUser()
  .subscribe({
      next : () => {
        sessionStorage.setItem("isLogin", "false");
        this.router.navigate(["/login"])
          console.log('User logged out successfully');
          // Optionally, redirect to another page after successful logout
      },
      error: (error) => {
          console.error('Logout failed:', error);
      }
    });
 }
public getAllFiles(){
  this.uploadService.getAllFiles().subscribe({
    next :(data: any[]) => {
    this.files = data;
      },
    error: (error) => {
    console.error('Failed to retrieve files:', error);
  }
});
}
 
onUpload(event:any) {
  // for(let file of event.files) {
      // this.uploadedFiles.push(file);
      console.log('Upload event triggered:', event);
  //     for(let file of event.files) {
  //       console.log('Uploading file:', file);
  //       this.uploadFile(file);
  // }
//   for(let file of event.files) {
//     this.uploadedFiles.push(file);
// }
      this.selectedFile = event.files[0];
  // this.uploadFile(event.files[0]);
  
  // if(file){
  //   this.uploadFile(file)
  // }

  // this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
}
}
