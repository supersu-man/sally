import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TokenService } from 'src/app/service/token.service';

declare const google: any;

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [ButtonModule, RouterModule, InputTextModule, ReactiveFormsModule, ConfirmDialogModule],
    templateUrl: './home.component.html',
    styles: ``
    
})
export class HomeComponent {

  constructor(private router: Router, private apiService: ApiService, private httpClient: HttpClient, private confirmationService: ConfirmationService, private tokenService: TokenService){}

  ngOnInit(): void {
    this.initializeGoogleSignIn();
  }

  initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: '433285191781-0aldo2uov77tsbdv31itrpvqkn1g002m.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this)
    });
    
    google.accounts.id.renderButton(
      document.getElementById("googleLoginButton"),
      { theme: "outline", size: "large", text: "sign_in_with" }
    );
  }

  handleCredentialResponse(response: any) {
    console.log(response.credential)
    this.apiService.signin(response.credential).subscribe({
      next: (res) => {
        this.router.navigate(['/dashboard'])
      },
      error: (err: HttpErrorResponse) => {
        if(err.status == 404) {
          this.registerDialog(response.credential)
        }
      }
    })
  }

  registerDialog = (token: string) => {
    this.confirmationService.confirm({
      message: 'Register account?',
      header: 'Account not found',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true,
      },
      acceptButtonProps: {
          label: 'Register',
          severity: 'primary',
      },

      accept: () => {
        this.registerAccount(token)
      },
      reject: () => { },
    });
  }

  registerAccount = (token: string) => {
    this.apiService.register(token).subscribe({
      next: (res) => {
        this.router.navigate(['/dashboard'])
      },
      error: (err) => {}
    })
  }


}