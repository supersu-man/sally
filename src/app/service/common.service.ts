import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  accessToken = ""
  user: { id: string } | undefined
  userNotfound = false

  addSallyPopup = false
  addExpensePopop = false
  addMemeberPopup = false

  togglePrivacy = () => {}
  disableOperations = false

  heading = ""

  spinner = false
}
