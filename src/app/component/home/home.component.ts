import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Sally } from 'src/app/interface/interface';


@Component({
    selector: 'app-home',
    standalone: true,
    imports: [ButtonModule, RouterModule, InputTextModule, ReactiveFormsModule],
    templateUrl: './home.component.html',
    styles: ``
})
export class HomeComponent {

  spinner = false
  sallyForm = new FormGroup({
    title: new FormControl<string|null>(null)
  })

  constructor(private router: Router, private apiService: ApiService){}

  ngOnInit(): void {}

  createSally = () => {
    const name = this.sallyForm.getRawValue().title
    console.log('Empty input')
    if(!name) return
    this.spinner = true
    this.apiService.createSally(name).subscribe({
      next: (res: any) => {
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
