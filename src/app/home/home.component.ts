import { Component } from '@angular/core';
import { CommonService } from '../service/common.service';
import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider, User, signInWithRedirect } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  user: User | null = null
  provider = new GoogleAuthProvider()

  constructor(private commonService: CommonService, private router: Router, private auth: Auth,
    private httpClient: HttpClient, private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.commonService.header_subject.next(null)
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.user = user
        this.authenticate()
      }
    })
  }

  login = () => { signInWithRedirect(this.auth, this.provider) }

  authenticate = () => {
    this.httpClient.post(environment.endpoint + '/login', { email: this.user?.email }).subscribe({
      next: (res: any) => {
        localStorage.setItem('user', JSON.stringify(res))
        this.router.navigate(['/dashboard'])
      },
      error: (error) => {
        if (error.status == 404) this.registrationDialog()
        else this.messageService.add({ severity: 'error', summary: error.statusText })
      }
    })
  }

  register = () => {
    this.httpClient.post(environment.endpoint + '/register', { email: this.user?.email, name: this.user?.displayName }).subscribe({
      next: (res) => {
        localStorage.setItem('user', JSON.stringify(res))
        this.router.navigate(['/dashboard'])
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: error.error || error.statusText })
        console.log(error)
      }
    })
  }

  registrationDialog = () => {
    this.confirmationService.confirm({
      message: 'Account not found with this email, create an account?',
      header: 'Register',
      icon: 'pi pi-exclamation-triangle',
      accept: () => { this.register() },
      reject: () => {
        this.auth.signOut()
        this.router.navigate(['/'])
      }
    })
  }
}
