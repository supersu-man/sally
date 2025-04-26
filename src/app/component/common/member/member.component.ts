import { Component, EventEmitter, Input, input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Excluded, Expense, Member, NewExpense } from 'src/app/interface/interface';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { DialogModule } from 'primeng/dialog';
import { ApiService } from 'src/app/service/api.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilService } from 'src/app/service/util.service';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-member',
  imports: [CardModule, Button, InputTextModule, FormsModule, ButtonGroupModule, DialogModule, TableModule],
  templateUrl: './member.component.html',
  styles: ``
})
export class MemberComponent implements OnInit {

  @Input() member!: Member;

  @Output() onUpdateRequest = new EventEmitter()

  @Output() excludeExpensePopup = new EventEmitter<{event: Event, excluded: Excluded[], expense_id: string}>()

  memberCopy!: Member

  expensePopup = false
  popupMode: 'add' | 'edit' = 'add'

  expense: any = { amount: 0, name: '', member_id: '' }

  constructor(private apiService: ApiService, 
    private messageService: MessageService,
    private utilService: UtilService) {}

  ngOnInit(): void {
    if(this.member)
      this.memberCopy = structuredClone(this.member)
  }

  resetNewExpense = () => {
    this.expense = { amount: 0, name: '' }
  }

  openEditPopup = (expense: Expense) => {
    this.expense = structuredClone(expense)
    this.popupMode = 'edit'
    this.expensePopup = true
  }

  openAddPopup = () => {
    this.popupMode = 'add'
    this.expensePopup = true
  }

  updateMemberName = (memberName: string, member: Member) => {
    this.apiService.updateMemberName(memberName, member.id).subscribe({
      next: (res: any) => {
        member.name = memberName
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Updated person name' })
      },
      error: (err) => {
        console.log(err)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to update person name' })
      }
    })
  }

  private deleteMember = (id: string) => {
    this.apiService.deleteMember(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Deleted person' })
        this.onUpdateRequest.emit()
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to delete person' })
      }
    })
  }

  addExpense = (expense: Expense) => {
    expense.paid_by = this.member.id
    expense.sally_id = this.member.sally_id
    this.apiService.addExpense(expense).subscribe({
      next: (res: any) => {
        this.expensePopup = false
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Saved expenses' })
        this.onUpdateRequest.emit()
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to save expenses' })
      }
    })
  }

  updateExpense = (expense: Expense) => {
    this.apiService.updateExpense(expense).subscribe({
      next: (res: any) => {
        this.expensePopup = false        
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Saved expenses' })
        this.onUpdateRequest.emit()
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to save expenses' })
      }
    })
  }

  private deleteExpense = (expenseId: string) => {
    this.apiService.deleteExpense(expenseId).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Deleted expense' })
        this.onUpdateRequest.emit()
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to delete expense' })
      }
    })
  }

  excludeExpensesPopup(event: Event, excluded: Excluded[], expense_id: string) {
    this.excludeExpensePopup.emit({event, excluded, expense_id})
  }

  deleteMemberPopup = (event: Event, id: string) => {
    this.utilService.confirmDialog(
      event,
      "Delete member?",
      "Are you sure you want to delete the member?",
      () => { this.deleteMember(id) }
    )
  }

  deleteExpensePopup = (event: Event, id: string) => {
    this.utilService.confirmDialog(
      event,
      "Delete expense?",
      "Are you sure you want to delete the expense?",
      () => { this.deleteExpense(id) }
    )
  }

}
