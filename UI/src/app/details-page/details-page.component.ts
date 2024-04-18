import { Component, OnInit } from '@angular/core';
import { Users } from '../users';
import { AdminService } from '../services/admin.service';
import { MessageService } from 'primeng/api';
import { UserService } from '../services/user.service';
import { DiaolgService } from '../services/diaolg.service';
import { Router } from '@angular/router';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.scss'
})



export class DetailsPageComponent implements OnInit {
  public username = "";
 public password = "";
 public email = "";
 public role ="";
 public selectedUser: any; 
 
 users:any; 

  user!: Users[];
  userActivity!: Users[];
  filesActivity!: Users[];
  visible: boolean = false;
  constructor(private adminService: AdminService, private messageService: MessageService, 
              private userService: UserService, public dialogService: DiaolgService, private router:Router) {}

  ngOnInit() {
      this.getUsers();
      this.getFilesActivity();
      this.getUserActivity();
  }

  private getUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        
        this.user = data
        console.log(data);
      },
      error: (error) => {
        console.error('Failed to get user:', error);
      }
    });
  }

  private getFilesActivity(): void {
    this.adminService.getAllFileActivity().subscribe({
      next: (data) => {
        console.log(data);
        this.filesActivity = data
      },
      error: (error) => {
        console.error('Failed to get Files Activity:', error);
      }
    });
  }


  private getUserActivity(): void {
    this.adminService.getAllUserActivity().subscribe({
      next: (data) => {
        console.log(data);
        this.userActivity = data;
      },
      error: (error) => {
        console.error('Failed to get User Activity:', error);
      }
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

   public refresh(){
    this.getUsers();
    this.getFilesActivity();
    this.getUserActivity();
   }
  // public findUser(){
  //   this.adminService.FindUser(this.username).subscribe({
  //     next: (data) => {
  //       this.users = data
  //       this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Found!' });
  //       console.log(data);
  //     },
  //     error: (error) => {
  //       console.error('Failed to found user:', error);
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User not found!' });
  //     }
  //   });
  //  }
  
//    public updateUser(): void {
//     this.adminService.UpdateUser(this.username, this.password, this.email).subscribe({
//       next: (data: any) => {
//         console.log(data);
//         if (data.message === 'User updated successfully') {
//           this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Updated!' });
//         } else if (data.error === 'User not found') {
//           this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User not found' });
//         } else {
//           this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user' });
//         }
//       },
//       error: (error) => {
//         console.error('Failed to update user:', error);
//         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user' });
//       }
//     });
//   }
  
  
//    public addUser() {
//     this.userService.registerUser(this.email, this.username, this.password, this.role).subscribe({
//       next: (data) => {
//         console.log(data);
  
//         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Added!' });
//       },
//       error: (error) => {
//         console.error('Failed to add user:', error);
//         if (error.error && error.error.error === 'User already exists') {
//           // Show warning toast message if user already exists
//           this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'User already exists!' });
//         } else {
//           // Show error toast message for other errors
//           this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add user!' });
//         }
//       }
//     });
//    }
  
//    public deleteUser() {
//     this.adminService.DeleteUser(this.username).subscribe({
//       next: (data) => {
//         console.log(data);
//         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Deleted!' });
//       },
//       error: (error) => {
//         console.error('Failed to Delete user:', error)
//           // Show error toast message for other errors
//           this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete user!' });
//         }
//     });
//    }

//    showDialog() {
//     this.visible = true;
// }
}
