import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public username!: string;
  public password!: string;

constructor(private router: Router, private userService: UserService) { }

public submit() {
  // if(this.username === "user" &&  this.password === "pass"){
  //   console.warn("success!!")
   

    this.userService.loginUser(this.username, this.password)
    .subscribe({
        next: () => {
          sessionStorage.setItem('isLogin', "true");
          this.router.navigate(["/admin"])
            console.log('User logged in successfully');
            // Optionally, redirect to another page after successful login
        },
        error: (error) => {
          sessionStorage.setItem('isLogin', "false");
            console.error('Login failed:', error);
        }
      }
    );

// Inside a component where user logout happens
// 
  }

  
}

