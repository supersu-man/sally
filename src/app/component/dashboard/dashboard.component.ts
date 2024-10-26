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
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { SupabaseService } from 'src/app/service/supabase.service';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ ToolbarModule, ContextMenuModule, ButtonModule, ProgressSpinnerModule, DialogModule, ReactiveFormsModule, RouterModule, InputTextModule ],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {

  sallys: Sally[] = []
  spinner = false

  addSallyPopup = false
  popupSpinner = false

  items = [{
    label: 'Delete',
    icon: 'pi pi-fw pi-trash',
    command: () => this.deleteSally()
  }]
  selectedSally: Sally | undefined

  sally_form = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required)
  })

  constructor(private messageService: MessageService, private apiService: ApiService, private supabaseService: SupabaseService) {
    this.getData()
  }

  createSally = () => {
    this.popupSpinner = true
    this.apiService.createSally(this.sally_form.getRawValue().name as string, (err) => {
      if(err) {
        this.messageService.add({ severity: 'error', summary: err.statusText })
      } else {
        this.messageService.add({ severity: 'success', summary: 'Sally created' })
        this.addSallyPopup = false
        this.getData()
      }
      this.popupSpinner = false
    })

  }

  getData = () => {
    this.spinner = true
    this.apiService.getSallys((res: Sally[], err: HttpErrorResponse | null) => {
      if(err) {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
      } else {
        this.sallys = res
      }
      this.spinner = false
    })
  }

  deleteSally = () => {
    this.spinner = true
    this.apiService.deleteSally(this.selectedSally?.id as string, (err) => {
      if(err) {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
      } else {
        this.messageService.add({ severity: 'success', summary: 'Sally deleted' })
        this.getData()
      }
      
    })
  }

  signout = () => {
    this.supabaseService.signOut()
  }

}
