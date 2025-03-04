import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit {

  spinner = false
  sallyForm = new FormGroup({
    title: new FormControl<string|null>(null)
  })
  sallys: any[] = []

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getSallys()
  }

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

  getSallys = () => {
    this.apiService.getSallys().subscribe({
      next: (res: any) => {
        this.sallys = res
        console.log(res)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }


}