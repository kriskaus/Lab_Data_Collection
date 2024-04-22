import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { error } from 'console';
import { Papa} from 'ngx-papaparse'
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrl: './add-user-dialog.component.scss'
})
export class AddUserDialogComponent {
  public username = "";
  public password = "";
  public email = "";
  public role ="";
  public selectedFile: any;
  public files: File[] = [];
constructor(private messageService: MessageService, private userService: UserService, private dialog:MatDialog, private papa:Papa) { }
  public addUser() {
    this.userService.registerUser(this.email, this.username, this.password, this.role).subscribe({
      next: (data) => {
        console.log(data);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Added!' });
        this.dialog.closeAll();
      },
      error: (error) => {
        console.error('Failed to add user:', error);
        if (error.error && error.error.error === 'User already exists') {
          // Show warning toast message if user already exists
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'User already exists!' });
        } else {
          // Show error toast message for other errors
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add user!' });
        }
      }
    });
   }


   onFileSelected(event: any) {
    if (event.files.length > 0) {
      this.selectedFile = event.files[0];
    }
  }


  public uploadFile() {
    if (!this.selectedFile) {
      return;
    }
      this.userService.uploadFile(this.selectedFile).subscribe(
       { next: (data) => {
          console.log(data);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Users Added!' });

        },
        error: (error)=>{
          console.log(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add users!' });
        }}
      );
  }

  // uploadFile() {
  //   if (!this.selectedFile) {
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select a file to upload.' });
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const csvData = reader.result as string;
  //     this.parseCSV(csvData);
  //   };
  //   reader.readAsText(this.selectedFile);
  // }

  // parseCSV(csvData: string) {
  //   this.papa.parse(csvData, {
  //     header: true,
  //     complete: (result) => {
  //       // Assuming CSV columns are 'username', 'email', 'password', 'role'
  //       result.data.forEach((row: any) => {
  //         const { username, email, password, role } = row;
  //         // Add user to the database using adminService or userService
  //         this.userService.registerUser(username, email, password, role).subscribe({
  //           next: () => {
  //             this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User added successfully.' });
  //           },
  //           error: (error) => {
  //             console.error('Failed to add user:', error);
  //             this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add user.' });
  //           }
  //         });
  //       });
  //     },
  //     error: (error) => {
  //       console.error('Error parsing CSV:', error);
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error parsing CSV file.' });
  //     }
  //   });
  // }


}
