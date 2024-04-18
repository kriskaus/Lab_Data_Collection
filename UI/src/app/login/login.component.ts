import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { AddUserDialogComponent } from '../dialogs/add-user-dialog/add-user-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public username!: string;
  public password!: string;

constructor(private router: Router, private userService: UserService, public dialog:MatDialog) { }

public submit() {
  // if(this.username === "user" &&  this.password === "pass"){
  //   console.warn("success!!")
   

    this.userService.loginUser(this.username, this.password)
    .subscribe({
        next: () => {
          this.getRole(this.username);
          localStorage.setItem('isLogin', "true");
          // this.router.navigate(["/admin"])
            console.log('User logged in successfully');
            // Optionally, redirect to another page after successful login
        },
        error: (error) => {
          localStorage.setItem('isLogin', "false");
            console.error('Login failed:', error);
        }
      }
    );

// Inside a component where user logout happens
// 
  }

  public getRole(username:string) {
    this.userService.getUserRole(username).subscribe({
      next: (data) => {

        if(data === "admin"){
        localStorage.setItem('role', "admin");
        console.log(data);
        this.router.navigate(["/details"]);
      }
      else{
        localStorage.setItem('role', "user");
        this.router.navigate(["/home"]);
      }
      },
      error: (error) => {
        console.error('Failed to get user role:', error);
      }
    });
    
  }

  // openDialog(): void {
  //   // const dialogRef = this.dialog.open(openAddUserDialog, {
  //   //   data: {name: this.name, animal: this.animal},
  //   // });

  //   // dialogRef.afterClosed().subscribe(result => {
  //   //   console.log('The dialog was closed');
  //   //   this.animal = result;
  //   // });
  //   this.dialog.open(AddUserDialogComponent)
  // }
}

