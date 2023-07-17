import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const commonGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  if (state.url == '/' && localStorage.getItem('user')) {
    router.navigate(['/dashboard'])
    return false
  }
  else if (state.url != '/' && !localStorage.getItem('user')) {
    router.navigate(['/'])
    return false
  }
  return true;
};
