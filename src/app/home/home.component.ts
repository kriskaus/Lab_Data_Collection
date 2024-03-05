import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UploadService } from '../services/upload.service';
import { error } from 'console';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  selectedFile: File | null = null;
  public showFile: File | null = null;
  UploadService: any;

  constructor(private http: HttpClient, private uploadService: UploadService) {}

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
    formData.append('file', this.selectedFile, this.selectedFile.name);
    this.uploadService.uploadfile(formData).subscribe({
      next: () => {
        console.log('file uploaded successfully');
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
        const downloadURL = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = filename;
        link.click();
        console.log('file download successfully');
      },

      error: (err) => {
        console.error('Failed to download file', err);
      },
    });
  }
}
