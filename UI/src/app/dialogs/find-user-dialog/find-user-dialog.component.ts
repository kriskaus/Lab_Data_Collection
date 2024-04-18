import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-find-user-dialog',
  templateUrl: './find-user-dialog.component.html',
  styleUrl: './find-user-dialog.component.scss'
})
export class FindUserDialogComponent {
  public username = "";
  public password = "";
  public email = "";
  public role ="";
  users: any;

constructor(private messageService: MessageService, private adminService: AdminService) { }
public findUser(){
  this.adminService.FindUser(this.username).subscribe({
    next: (data) => {
      this.users = data
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Found!' });
      console.log(data);
    },
    error: (error) => {
      console.error('Failed to found user:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User not found!' });
    }
  });
 }


}