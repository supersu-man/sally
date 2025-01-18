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
  imports: [ ToolbarModule, ContextMenuModule, ButtonModule, ProgressSpinnerModule, DialogModule, FormsModule, RouterModule, InputTextModule, CardModule ],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit  {

  sally_id = this.route.snapshot.paramMap.get('sally_id') as string
  sally: Sally | undefined
  sally_form: Sally | undefined
  newExpenses: any = {}

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
        console.log(res)
        this.sally = res
        this.sally_form = structuredClone(res)

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

  addExpense = (member: Member) => {
    member.expenses.push({ id: undefined, name: undefined, amount: undefined, member_id: member.id, sally_id: this.sally_id })

  }

  modelChange = (member: Member, oldMember: Member) => {
    const expenses: Expense[] = []
    member.expenses.forEach(element => {
      if(element.name && element.amount) expenses.push(element)
    });
    const oldExpenses = oldMember.expenses || []
    console.log(expenses)
    if(expenses.length != oldExpenses.length) { 
      return this.newExpenses[member.id] = expenses
    }
    for (let index = 0; index < expenses.length; index++) {
      if(expenses[index].name != oldExpenses[index].name || expenses[index].amount != oldExpenses[index].amount){
        return this.newExpenses[member.id] = expenses
      }
    }
    return delete this.newExpenses[member.id]
  }

  saveExpense = (member: Member, newMember: Member) => {
    this.apiService.addExpense(this.newExpenses[member.id]).subscribe({
      next: (res: any) => {
        this.newExpenses = []
        member.expenses = res
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    })
  }

  deleteExpense = (member: Member, expense: Expense) => {
    if(!expense.id || !expense.sally_id || !expense.member_id) return
    this.apiService.deleteExpense(expense.sally_id, expense.member_id, expense.id).subscribe({
      next: (res) => {
        member.expenses = member.expenses.filter((exp) => { return exp.id != expense.id })
        console.log(res)
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    })
  }

  saveName = (member: Member, oldMember: Member) => {
    const sally_id = this.sally_id
    this.apiService.saveName(sally_id, member.id, member.name).subscribe({
      next: (res: any) => {
        oldMember.name = member.name
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  deleteMember = (id: string) => {
    this.apiService.deleteMember(this.sally_id, id).subscribe({
      next: () => {
        this.getData()
        console.log("Deleted")
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    })
  }

  editName = () => {
    
  }

}