import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router  = inject( Router);
  const authService = inject(UserService);

  const userRole = localStorage.getItem('role');

    if (userRole === 'admin') {
      return true; // Allow access to admin routes
    } 
    else if(userRole === 'user'){
       // Redirect to home component for non-admin users
      return true;
    }
    else {
      router.navigate(['/home']); // Redirect to home component for non-admin users
      return false;
    }
};
