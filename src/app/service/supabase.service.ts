import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabaseClient = createClient(environment.url, environment.key)

  constructor(private commonService: CommonService) {
    this.supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event == 'TOKEN_REFRESHED') {
        this.commonService.accessToken = session?.access_token as string 
      }
    })
  }

  async getAccessToken() {
    let token =  (await this.supabaseClient.auth.getSession()).data.session?.access_token
    return token
  }

  async signIn() {
    await this.supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: window.location.origin
      }
    })
  }

  async signOut() {
    await this.supabaseClient.auth.signOut()
    window.location.reload()
  }
}
