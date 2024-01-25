import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonService } from '../service/common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Sally } from '../interface/interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {

  sallys: Sally[] = []
  spinner = false

  popupSpinner = false

  items = [{
    label: 'Delete',
    icon: 'pi pi-fw pi-trash',
    command: () => this.deleteSally()
  }]
  selectedSally: Sally | undefined

  sally_form = new FormGroup({
    name: new FormControl(null, Validators.required)
  })

  constructor(private messageService: MessageService, public commonService: CommonService, private httpClient: HttpClient) {
    this.getData()
  }

  createSally = () => {
    this.popupSpinner = true
    const headers = new HttpHeaders({ 'Authorization': this.commonService.accessToken as string })
    this.httpClient.post(environment.endpoint + '/sally', this.sally_form.getRawValue(), { headers }).subscribe({
      next: (sally) => {
        this.messageService.add({ severity: 'success', summary: 'Sally created' })
        this.commonService.addSallyPopup = false
        this.sallys.push(sally as Sally)
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: err.statusText })
        console.log(err)
      },
    }).add(() => this.popupSpinner = false )
  }

  getData = () => {
    this.spinner = true
    const headers = new HttpHeaders({ 'Authorization': this.commonService.accessToken as string })
    this.httpClient.get(environment.endpoint + '/sallys', { headers }).subscribe({
      next: (res) => this.sallys = res as Sally[],
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
        console.log(err)
      }
    }).add(() => { this.spinner = false })
  }

  deleteSally = () => {
    const headers = new HttpHeaders({ 'Authorization': this.commonService.accessToken as string })
    this.httpClient.delete(environment.endpoint + '/sally', { body: { sally_id: this.selectedSally?.id }, headers }).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Sally deleted' })
        this.sallys = this.sallys.filter(sally => { return sally.id != this.selectedSally?.id })
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
        console.log(err)
      }
    })
  }

}
