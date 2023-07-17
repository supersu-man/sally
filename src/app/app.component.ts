import { Component } from '@angular/core';
import { CommonService } from './service/common.service';
import { Auth } from '@angular/fire/auth';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'sally';
  header: any
  constructor(public commonService: CommonService, private auth: Auth) {
    this.commonService.header_subject.subscribe((header) => { this.header = header })
  }

  logout = () => {
    localStorage.removeItem('user')
    this.auth.signOut()
  }

}
