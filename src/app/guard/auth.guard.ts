import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {

  const routerService = inject(Router)

  if(!localStorage.getItem('accessToken') && state.url != '/' && !state.url.includes('access_token')) {
    routerService.navigate(['/'])
    return false
  }

  return true;
};
