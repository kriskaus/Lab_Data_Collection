import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrl: './delete-user-dialog.component.scss'
})
export class DeleteUserDialogComponent {
  public username = "";

constructor(private messageService: MessageService, private adminService: AdminService) { }
public deleteUser() {
  this.adminService.DeleteUser(this.username).subscribe({
    next: (data) => {
      console.log(data);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Deleted!' });
    },
    error: (error) => {
      console.error('Failed to Delete user:', error)
        // Show error toast message for other errors
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete user!' });
      }
  });
 }

}