import { Component } from '@angular/core';
import { CommonService } from './service/common.service';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { SupabaseService } from './service/supabase.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'sally';
  constructor(public commonService: CommonService, public router: Router, public supabaseService: SupabaseService, private httpClient: HttpClient) {
    console.log(this.router.url)
  }

  deleteUser() {
    const headers = new HttpHeaders({ 'Authorization': this.commonService.accessToken })
    this.httpClient.delete(environment.endpoint + '/user', { headers }).subscribe({
      next: (value) => {
        console.log("deleted")
      }, 
      error: (err) => {
        console.log(err)
      }
    })
  }

}
