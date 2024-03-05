import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  public username!: Number;
  public password!: string;
  public email! : string;

  constructor(private router: Router, private userService: UserService) { }
  public submit() {
    // if(this.username === "user" &&  this.password === "pass"){
    //   console.warn("success!!")
  
    this.userService.registerUser(this.email, this.username, this.password )
      .subscribe({
           next: () => {
            this.router.navigate(["/login"])
              console.log('User logged in successfully');
              // Optionally, redirect to another page after successful login
          },
          error: (error: any) => {
              console.error('Login failed:', error);
          }
        });
  
  // Inside a component where user logout happens
  // this.userService.logoutUser()
  //     .subscribe({
  //         next : () => {
  //             console.log('User logged out successfully');
  //             // Optionally, redirect to another page after successful logout
  //         },
  //         error: (error: any) => {
  //             console.error('Logout failed:', error);
  //         }
  //       });
  // }
      }
}
