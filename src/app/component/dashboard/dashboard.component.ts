import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ContextMenuService, MessageService } from 'primeng/api';
import { Expense, Member, Sally } from 'src/app/interface/interface';
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
export class DashboardComponent implements OnInit  {

  sally_id = this.route.snapshot.paramMap.get('sally_id') as string
  sally: Sally | undefined
  sallyForm: any

  spinner = false

  editSallyPopup = false
  popupSpinner = false



  constructor(private route: ActivatedRoute, private messageService: MessageService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.getData()
  }

  getData = () => {
    this.spinner = true
    this.apiService.getSally(this.sally_id).subscribe({
      next: (res: any) => {
        this.sally = res
        this.dataToForm()
        this.spinner = false
      },
      error: (err: HttpErrorResponse) => {
        this.spinner = false
      }
    })
  }

  dataToForm = () => {
    const members: any[] = []
    this.sally?.members.forEach(member => {
      const expenses: any[] = []
      member.expenses.forEach(expense => {
        expenses.push(this.getExpenseForm(expense))
      })
      members.push(this.getMemberForm(member, expenses))
    })
    this.sallyForm = this.getSallyForm(this.sally as Sally, members)

    console.log(this.sallyForm.controls.members.controls[0])
    
  }

  getExpenseForm = (expense: Expense) => {
    return new FormGroup({
      id: new FormControl<string>(expense.id, Validators.required),
      name: new FormControl<string>(expense.name, Validators.required),
      amount: new FormControl<number>(expense.amount, Validators.required),
    })
  }

  getMemberForm = (member: Member, expenses: any[]) => {
    return new FormGroup({
      id: new FormControl<string>(member.id, Validators.required),
      name: new FormControl<string>(member.name, Validators.required),
      expense_name: new FormControl<string|null>(null, Validators.required),
      expense_amount: new FormControl<number|null>(null, Validators.required),
      expenses: new FormArray(expenses)
    })
  }

  getSallyForm = (sally: Sally, members: any[]) => {
    return new FormGroup({
      id: new FormControl<string>(sally.id, Validators.required),
      name: new FormControl<string>(sally.name, Validators.required),
      members: new FormArray(members)
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

  addExpense = (member: any) => {
    const member_id = member.id
    const amount = member.expense_amount
    const name = member.expense_name
    const sally_id = this.sally_id
    console.log(member)
    this.apiService.addExpense(member_id, sally_id, name, amount).subscribe({
      next: (res) => {
        this.getData()
      }, 
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    })
  }

  saveName = (id: string, name: string) => {
    console.log(id, name)
  }

  editName = () => {
    
  }

}