import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from './service/supabase.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ ToastModule, RouterOutlet ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'sally';
  constructor(public supabaseService: SupabaseService) {

    this.supabaseService.supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event == 'TOKEN_REFRESHED') {
        localStorage.setItem('accessToken', session?.access_token as string)
      }
    })
    
  }

}
