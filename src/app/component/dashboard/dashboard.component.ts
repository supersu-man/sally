import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {

  spinner = false
  sallyForm = new FormGroup({
    title: new FormControl<string|null>(null)
  })


  constructor(private apiService: ApiService, private router: Router) {}

  createSally = () => {
    const name = "Testing"
    this.spinner = true
    this.apiService.createSally(name).subscribe({
      next: (res: any) => {
        console.log(res)
        this.spinner = false
        this.router.navigate([res[0].id])
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        this.spinner = false
      }
    })
  }


}