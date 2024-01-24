import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../service/common.service';
import { inject } from '@angular/core';
import { SupabaseService } from '../service/supabase.service';
import { delay, lastValueFrom } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

export const authGuard: CanActivateFn = async (route, state) => {
  console.log(state.url, "authGuard")

  const commonService = inject(CommonService)
  const supabaseService = inject(SupabaseService)
  const routerService = inject(Router)
  const httpClient = inject(HttpClient)
  const messageService = inject(MessageService)

  commonService.spinner = true

  let token = ""
  if(!commonService.accessToken) {
    token = await supabaseService.getAccessToken() as string
  }

  if(token) {
    commonService.accessToken = token
    const headers = new HttpHeaders({ 'Authorization': token as string })
    await lastValueFrom(httpClient.get(environment.endpoint + '/user', { headers })).then((value: any) => {
      commonService.user = value
      console.log(value)
    }).catch((error: HttpErrorResponse) => {
      if (error.status == 404) {
        commonService.userNotfound = true
      }
      if(error.status == 0) {
        messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to connect to servers', life: 6000 });
      }
    })
  }


  if((!commonService.accessToken || !commonService.user) && state.url != '/') {
    routerService.navigate(['/'])
    return false
  }
  
  commonService.spinner = false
  return true;
};
