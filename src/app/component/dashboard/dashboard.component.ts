import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ApiService } from 'src/app/service/api.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';

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

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getSallys()
  }

  createSally = () => {
    const title = this.sallyForm.getRawValue().title
    if(!title) return

    this.popupSpinner = true
    this.apiService.createSally(title).subscribe({
      next: (res: any) => {
        console.log(res)
        this.popupSpinner = false
        this.createSallyPopup = false
        this.getSallys()
        // this.router.navigate([res[0].id])
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        this.popupSpinner = false
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
      }
    })
  }

}