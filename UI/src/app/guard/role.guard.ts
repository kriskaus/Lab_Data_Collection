import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router  = inject( Router);
  const authService = inject(UserService);)

  const userRole = authService.getUserRole();

    if (userRole === 'admin') {
      return true; // Allow access to admin routes
    } else {
      router.navigate(['/home']); // Redirect to home component for non-admin users
      return false;
    }
};
