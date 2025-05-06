import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ApiService } from 'src/app/service/api.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { StepperModule } from 'primeng/stepper';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, ButtonModule, DialogModule, InputTextModule, ReactiveFormsModule, ProgressSpinner, StepperModule],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit {

  spinner = false
  sallys: any[] = []

  sallyPopupProps = {
    showPopup: false,
    showPopopSpinner: false,
    page: 1,
    memberForm: new FormGroup({ members: new FormArray<FormControl<String|null>>([]) }),
    sallyForm: new FormGroup({
      title: new FormControl<string|null>(null, Validators.required),
      headcount: new FormControl<number|null>(null, [Validators.required, Validators.max(30)])
    })
  }

  constructor(private apiService: ApiService, private router: Router, private messageService: MessageService, private tokenService: TokenService) {}

  ngOnInit(): void {
    this.getSallys()
  }

  get members(): FormArray {
    return this.sallyPopupProps.memberForm.controls.members as FormArray;
  }


  createMembersForm = () => {
    const headCount = this.sallyPopupProps.sallyForm.getRawValue().headcount
    if(!headCount) return;
    (this.sallyPopupProps.memberForm.get('members') as FormArray).clear();
    for (let index = 0; index < headCount; index++) {
      this.sallyPopupProps.memberForm.controls.members.push(
        new FormControl(null, Validators.required)
      );
    }
    this.sallyPopupProps.page+=1
  }

  openSallyPopup = () => {
    this.sallyPopupProps.page = 1
    this.sallyPopupProps.showPopup = true
  }

  createSally = () => {
    const payload = { ...this.sallyPopupProps.sallyForm.getRawValue(), ...this.sallyPopupProps.memberForm.getRawValue() }
    this.sallyPopupProps.showPopopSpinner = true
    this.apiService.createSally(payload).subscribe({
      next: (res: any) => {
        this.sallyPopupProps.showPopopSpinner = false
        this.sallyPopupProps.showPopup = false
        this.router.navigate(['dashboard/'+res[0].id])
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        this.sallyPopupProps.showPopopSpinner = false
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

  logout = () => {
    this.tokenService.removeToken()
    this.router.navigate(['/'])
  }

}