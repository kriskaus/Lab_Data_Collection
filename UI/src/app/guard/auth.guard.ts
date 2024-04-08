import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, map, } from 'rxjs';
import { UserService } from '../services/user.service'; // Import your AuthService

@Injectable({
 providedIn: 'root'
})
export class AuthGuard {
 constructor(private authService: UserService, private router: Router) {}

 canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if(this.authService.isAuthenticated()){
          return true;
        } else {
          this.router.navigate(['/login']); // Redirect to login if not authenticated
          return false;
        }
 }
}