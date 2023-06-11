import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  header_subject = new Subject<any>
  header_operation = new Subject<string>

  constructor() { }
}
