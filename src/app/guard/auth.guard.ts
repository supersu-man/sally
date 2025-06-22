import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const routerService = inject(Router)
  const token = localStorage.getItem('accessToken')
  if(!token && state.url != '/') {
    routerService.navigate(['/'])
    return false
  }

  if(token && state.url == '/') {
    routerService.navigate(['/dashboard'])
    return false
  }

  return true;
};
