import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private confirmationService: ConfirmationService) { }


  confirmDialog = (event: Event, header: string, message: string, onAccept: () => void) => {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: message,
      header: header,
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true,
      },
      acceptButtonProps: {
          label: 'Yes',
          severity: 'primary',
      },
      accept: () => {
        onAccept()
      },
      reject: () => { },
    });
  }
}
