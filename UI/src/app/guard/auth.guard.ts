import { CanActivateFn, Router } from '@angular/router';

import {inject } from '@angular/core';
export const authGuard: CanActivateFn = (route, state) => {
  const router  = inject( Router);
  let isLoggedIn =   localStorage.getItem('isLogin');
  if(isLoggedIn === 'false'){
    router.navigate(['/login']); // Redirect to login if not authenticated
    return false;
  
  } else {
    return true; // Redirect to home if authenticated
  }
};
