import { Component } from '@angular/core';
import { CommonService } from './service/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sally';
  header: any
  constructor(public commonService: CommonService){
    this.commonService.header_subject.subscribe((header) => { this.header = header })
  }

}
