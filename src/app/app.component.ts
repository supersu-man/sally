import { Component } from '@angular/core';
import { CommonService } from './service/common.service';
import { Auth } from '@angular/fire/auth';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'sally';
  header: any
  constructor(public commonService: CommonService, private auth: Auth, private router: Router) {
    this.commonService.header_subject.subscribe((header) => { this.header = header })
  }

  logout = () => {
    localStorage.removeItem('user')
    this.auth.signOut().then(() => {
      this.router.navigate(['/'])
    })
  }

}
