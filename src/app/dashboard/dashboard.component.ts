import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonService } from '../service/common.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Sally, MyUser } from '../interface/interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {

  user = JSON.parse(localStorage.getItem('user') as string) as MyUser

  sallys: Sally[] = []
  spinner = false

  addSallyPopup = false
  popupSpinner = false

  items = [{
    label: 'Delete',
    icon: 'pi pi-fw pi-trash',
    command: () => this.delete()
  }]
  selectedSally: Sally | undefined

  sally_form = new FormGroup({
    name: new FormControl(null, Validators.required),
    user_id: new FormControl(this.user.id)
  })

  constructor(private messageService: MessageService, private commonService: CommonService, private httpClient: HttpClient) {
    this.commonService.header_subject.next({ title: 'Dashboard', addSally: true, logout: true })
    this.commonService.header_operation.subscribe((val) => {
      if (val == 'addSally') this.addSallyPopup = true
    })
    this.get_data()
  }

  create_sally = () => {
    this.popupSpinner = true
    this.httpClient.post(environment.endpoint + '/create-sally', this.sally_form.getRawValue()).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Sally created' })
        this.get_data()
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
        console.log(err)
      },
      complete: () => {
        this.popupSpinner = false
        this.addSallyPopup = false
      }
    })
  }

  get_data = () => {
    this.spinner = true
    this.httpClient.post(environment.endpoint + '/get-sallys', { user_id: this.user.id }).subscribe({
      next: (res) => this.sallys = res as Sally[],
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
        console.log(err)
      },
      complete: () => { this.spinner = false }
    })
  }

  delete = () => {
    this.httpClient.post(environment.endpoint + '/delete-sally', { sally_id: this.selectedSally?.id, user_id: this.user.id }).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Sally deleted' })
        this.get_data()
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
        console.log(err)
      }
    })
  }

}
