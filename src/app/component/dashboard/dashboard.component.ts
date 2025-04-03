import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ApiService } from 'src/app/service/api.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, ButtonModule, DialogModule, InputTextModule, ReactiveFormsModule, ProgressSpinner],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit {

  spinner = false
  sallyForm = new FormGroup({
    title: new FormControl<string|null>(null, Validators.required)
  })
  sallys: any[] = []

  createSallyPopup = false
  popupSpinner = false

  constructor(private apiService: ApiService, private router: Router, private messageService: MessageService) {}

  ngOnInit(): void {
    this.getSallys()
  }

  createSally = () => {
    const title = this.sallyForm.getRawValue().title
    if(!title) return

    this.popupSpinner = true
    this.apiService.createSally(title).subscribe({
      next: (res: any) => {
        this.popupSpinner = false
        this.createSallyPopup = false
        this.router.navigate(['dashboard/'+res[0].id])
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        this.popupSpinner = false
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to create sally' })
      }
    })
  }

  getSallys = () => {
    this.spinner = true
    this.apiService.getSallys().subscribe({
      next: (res: any) => {
        this.sallys = res
        this.spinner = false
      },
      error: (err) => {
        console.log(err)
        this.spinner = false
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to get sallys' })
      }
    })
  }

}