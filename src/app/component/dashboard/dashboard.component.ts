import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContextMenuService, MessageService } from 'primeng/api';
import { Sally } from 'src/app/interface/interface';
import { ApiService } from 'src/app/service/api.service';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { SupabaseService } from 'src/app/service/supabase.service';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ ToolbarModule, ContextMenuModule, ButtonModule, ProgressSpinnerModule, DialogModule, ReactiveFormsModule, RouterModule, InputTextModule, CardModule ],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {

  sally_id = this.route.snapshot.paramMap.get('sally_id') as string
  sally: Sally | undefined

  spinner = false

  editSallyPopup = false
  popupSpinner = false

  sally_form = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required)
  })

  constructor(private route: ActivatedRoute, private messageService: MessageService, private apiService: ApiService, private supabaseService: SupabaseService) {
    this.getData()
  }

  getData = () => {
    this.spinner = true
    this.apiService.getSally(this.sally_id).subscribe({
      next: (res: any) => {
        console.log(res)
        this.sally = res
        this.spinner = false
      },
      error: (err: HttpErrorResponse) => {
        this.spinner = false
      }
    })
  }

  addMember = () => {
    this.apiService.addMember("Person Name", this.sally_id).subscribe({
      next: (res) => {
        this.getData()
      },
       error: (err: HttpErrorResponse) => {

       }
    })
  }

  editName = () => {
    this.supabaseService.signOut()
  }

}
