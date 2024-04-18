import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-update-user-dialog',
  templateUrl: './update-user-dialog.component.html',
  styleUrl: './update-user-dialog.component.scss'
})
export class UpdateUserDialogComponent {
  public username = "";
  public password = "";
  public email = "";
  public role ="";

constructor(private messageService: MessageService, private adminService: AdminService) { }
public updateUser(): void {
  this.adminService.UpdateUser(this.username, this.password, this.email, this.role).subscribe({
    next: (data: any) => {
      console.log(data);
      if (data.message === 'User updated successfully') {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Updated!' });
      } else if (data.error === 'User not found') {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User not found' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user' });
      }
    },
    error: (error) => {
      console.error('Failed to update user:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user' });
    }
  });
}

}