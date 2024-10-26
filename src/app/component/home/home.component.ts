import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/service/api.service';
import { SupabaseService } from 'src/app/service/supabase.service';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, RouterModule ],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {

  spinner = false

  constructor(private router: Router, private supabaseService: SupabaseService, private messageService: MessageService, private confirmationService: ConfirmationService, private apiService: ApiService){}

  ngOnInit(): void {
    this.apiService.checkUser((err) => {
      if (err?.status == 404) {
        this.registrationDialog()
      }
    })
  }

  isAccessToken() {
    return localStorage.getItem('accessToken') as string  
  }

  login = () => {
    this.spinner = true
    this.supabaseService.signIn()
  }

  register = () => {
    this.spinner = true
    this.apiService.register((err) => {
      if(err) {
        this.messageService.add({ severity: 'error', summary: err.statusText })
      } else {
        this.router.navigate(['/dashboard'])
      }
      this.spinner = false
    })
  }

  registrationDialog = () => {
    this.confirmationService.confirm({
      message: 'Account not found with this email, create an account?',
      header: 'Register?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => { this.register() },
      reject: () => { this.supabaseService.signOut() }
    })
  }

}
