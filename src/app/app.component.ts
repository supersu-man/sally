import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from './service/supabase.service';
import { HttpClient } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ ToastModule, ConfirmDialogModule, RouterModule ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'sally';
  constructor(public router: Router, public supabaseService: SupabaseService, private httpClient: HttpClient) {
    this.supabaseService.supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event == 'TOKEN_REFRESHED') {
        localStorage.setItem('accessToken', session?.access_token as string)
      }
      if (event == 'INITIAL_SESSION' && session?.access_token) {
        localStorage.setItem('accessToken', session?.access_token as string)
      }
    })
  }

}
