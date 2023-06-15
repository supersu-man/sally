import { Component } from '@angular/core';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  constructor(private commonService : CommonService) {
    this.commonService.header_subject.next(null)
  }
}
