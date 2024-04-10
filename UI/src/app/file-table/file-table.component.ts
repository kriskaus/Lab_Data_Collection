import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-file-table',
  templateUrl: './file-table.component.html',
  styleUrl: './file-table.component.scss'
})
export class FileTableComponent implements OnInit{
  files: any[] = [];

  constructor(private uploadService: UploadService) { }

  ngOnInit(): void {
    // Retrieve file information from the backend
    this.uploadService.getAllFiles().subscribe(
      (data: any[]) => {
        this.files = data;
      },
      (error: any) => {
        console.error('Failed to retrieve files:', error);
      }
    );
  }

  downloadFile(filename: string) {
    // Call the download method in the UploadService
    this.uploadService.downloadFile(filename).subscribe(
      (data: BlobPart) => {
        // Create a Blob from the file data
        const blob = new Blob([data], { type: 'application/octet-stream' });

        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a link element and trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();

        // Release the URL object
        window.URL.revokeObjectURL(url);
      },
      (error: any) => {
        console.error('Failed to download file:', error);
      }
    );
  }
}
