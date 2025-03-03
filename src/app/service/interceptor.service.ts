import { HttpClient, HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  constructor() { }

}

export function sendTokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {

  if(req.url.endsWith('/user/signin') || req.url.endsWith('/user/register') || req.url.endsWith('/user/token')) {
    return next(req)
  }
  const token = inject(TokenService).getToken()
  console.log(token, '\n', req.url)
  const reqWithHeader = req.clone({
    headers: req.headers.set('Authorization', token),
  });
  return next(reqWithHeader);
}

export function saveTokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if(req.url.endsWith('/user/token')) {
    return next(req)
  }
  const tokenService = inject(TokenService)
  
  return next(req).pipe(
    tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        const newToken = event.headers.get('Authorization');
        console.log('newToken', newToken)
        if(newToken) {
          tokenService.saveToken(newToken);
        }
      }
    })
  );
  
}

export function refreshTokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if(req.url.endsWith('/user/token')) {
    return next(req)
  }
  const tokenService = inject(TokenService)
  const apiService = inject(ApiService)
  
  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401) {
        console.log("handleRefreshToken");
        return handleRefreshToken(req, next, tokenService, apiService)
      }
      return throwError(() => err);
    })
  );
  
}

function handleRefreshToken(req: HttpRequest<unknown>, next: HttpHandlerFn, tokenService: TokenService, apiService: ApiService) {
  return apiService.getNewToken(tokenService.getToken()).pipe(
    switchMap((tokenObj: any) => {
      console.log('refreshed token ', tokenObj)
      tokenService.saveToken(tokenObj.newToken);
      const reqWithHeader = req.clone({
        headers: req.headers.set('Authorization', tokenObj.newToken),
      });
      return next(reqWithHeader);
    }),
    catchError((refreshError) => {
      console.error("Token refresh failed", refreshError);
      return throwError(() => refreshError);
    })
  );
}