import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const urlParams = new URLSearchParams(state.url)
  const accessToken = urlParams.get("/#access_token")
  accessToken && localStorage.setItem('accessToken', accessToken)

  const routerService = inject(Router)
  if(!localStorage.getItem('accessToken') && state.url != '/') {
    routerService.navigate(['/'])
    return false
  }

  return true;
};
