import { Component } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Users } from '../users';
import { UserService } from '../services/user.service';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  // providers: [MessageService]
})
export class AdminDashboardComponent {
 public username = "";
 public password = "";
 public email = "";
 
 users:any;

 constructor( private userService: UserService, private adminService: AdminService,
              private messageService: MessageService, private router: Router) {}

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

 public updateUser(username: string, password: string, email: string): void {
  this.adminService.UpdateUser(username, password, email).subscribe({
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


 public addUser(username: string, password: string, email: string) {
  this.userService.registerUser(email, username, password).subscribe({
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

 public deleteUser(username: string) {
  this.adminService.DeleteUser(username).subscribe({
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

//  public showSuccessMessage(message: string): void {
//   this.snackBar.open(message, 'Close', {
//     duration: 3000, // Duration in milliseconds
//     horizontalPosition: 'center',
//     verticalPosition: 'bottom',
//     panelClass: ['success-toast'],
    
//   });
// }

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

}
