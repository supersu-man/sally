import { Component, OnInit } from '@angular/core';
import { CommonService } from '../service/common.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SupabaseService } from '../service/supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  spinner = false

  constructor(public commonService: CommonService, private router: Router, private supabaseService: SupabaseService,
    private httpClient: HttpClient, private messageService: MessageService, private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    if(this.commonService.userNotfound) {
      this.registrationDialog()
    }
  }

  login = () => {
    this.spinner = true
    this.supabaseService.signIn()
  }

  register = () => {
    this.spinner = true
    console.log(this.commonService.accessToken)
    const headers = new HttpHeaders({ 'Authorization': this.commonService.accessToken as string })
    this.httpClient.post(environment.endpoint + '/user', {}, { headers }).subscribe({
      next: (res: any) => {
        this.commonService.user = res
        this.router.navigate(['/dashboard'])
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: err.statusText })
        console.log(err)
      }
    }).add(() => this.spinner = false)
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