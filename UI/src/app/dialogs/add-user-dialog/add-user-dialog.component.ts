import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';

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

constructor(private messageService: MessageService, private userService: UserService) { }
  public addUser() {
    this.userService.registerUser(this.email, this.username, this.password, this.role).subscribe({
      next: (data) => {
        console.log(data);
  
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Added!' });
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

}
