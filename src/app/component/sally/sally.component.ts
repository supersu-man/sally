import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Excluded, Expense, Member, Sally } from 'src/app/interface/interface';
import { ApiService } from 'src/app/service/api.service';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CheckboxModule } from 'primeng/checkbox';
import { MemberComponent } from "../common/member/member.component";
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-sally',
  imports: [ToolbarModule, ContextMenuModule, ButtonModule, ProgressSpinnerModule, DialogModule, FormsModule, RouterModule, InputTextModule, CardModule, ConfirmPopupModule, CheckboxModule, MemberComponent, ConfirmDialog],
  templateUrl: './sally.component.html',
  styles: ``
})
export class SallyComponent implements OnInit {

  sally_id = this.route.snapshot.paramMap.get('sally_id') as string
  sally: Sally | undefined
  sallyName = ''
  personName = ''

  spinner = false

  totalExpenses = 0

  editNamePopup = false
  addPersonPopup = false


  constructor(private route: ActivatedRoute, private messageService: MessageService, private apiService: ApiService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.getData()
  }

  resetName = () => {
    this.sallyName = this.sally?.name as string
  }

  confirm() {
    this.confirmationService.confirm({
      icon: 'pi pi-exclamation-circle',
      rejectButtonProps: {
        label: 'Cancel',
        icon: 'pi pi-times',
        outlined: true,
        size: 'small'
      },
      acceptButtonProps: {
        label: 'Save',
        icon: 'pi pi-check',
        size: 'small'
      },
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }



  getData = () => {
    this.spinner = true
    this.apiService.getSally(this.sally_id).subscribe({
      next: (res: any) => {
        console.log(res)
        this.sally = res
        this.sallyName = this.sally?.name as string

        this.updateStats()

        this.spinner = false
      },
      error: (err: HttpErrorResponse) => {
        this.spinner = false
      }
    })
  }

  updateSallyName = (name: string) => {
    this.apiService.updateSallyName(this.sally_id, name).subscribe({
      next: (res: any) => {
        if (this.sally) this.sally.name = res[0].name
        this.editNamePopup = false
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Updated Sally name' })
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to update Sally name' })
      }
    })
  }

  addMember = (name: string) => {
    this.sally && this.apiService.addMember(name, this.sally_id).subscribe({
      next: (res: any) => {
        this.personName = ''
        this.addPersonPopup = false
        this.getData()
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    })
  }

  updateMemberName = (member: Member, oldmember: Member) => {
    console.log(oldmember.name)
    console.log(member.name)
    this.apiService.saveName(member.sally_id, member.id, member.name).subscribe({
      next: (res: any) => {
        oldmember.name = member.name
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Updated person name' })
      },
      error: (err) => {
        console.log(err)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to update person name' })
      }
    })
  }

  deleteMember = (member: Member) => {
    this.apiService.deleteMember(member.sally_id, member.id).subscribe({
      next: () => {
        this.getData()
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Deleted person' })
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to delete person' })
      }
    })
  }


  saveExpense = (expences: Expense[]) => {
    this.apiService.addExpense(expences).subscribe({
      next: (res: any) => {
        this.getData()
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Saved expenses' })
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to save expenses' })
      }
    })
  }

  deleteExpense = (expense: Expense) => {
    this.apiService.deleteExpense(expense.sally_id, expense.member_id, expense.id as string).subscribe({
      next: (res) => {
        this.getData()
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Deleted expense' })
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to delete expense' })
      }
    })
  }


  toBePaid: any = {}
  paidAlready: any = {}
  names: any = {}

  updateStats = () => {
    this.sally?.members.forEach((member) => {
      this.names[member.id] = member.name
      if (member.expenses.length == 0) this.paidAlready[member.id] = 0
      member.expenses.forEach(expense => {
        if (this.paidAlready[member.id]) this.paidAlready[member.id] += expense.amount
        else this.paidAlready[member.id] = expense.amount

        this.getExpenseSplitForExcept(expense.excluded, expense.amount || 0)
      })
    })

    this.doTheDifference()
    console.log(this.paidAlready)
    console.log(this.toBePaid)
  }

  getExpenseSplitForExcept(excluded: Excluded[], amount: number) {
    const temp: string[] = []

    this.sally?.members.forEach(member => {
      const found = excluded.find(ex => { return member.id == ex.member_id })
      if (!found) temp.push(member.id)
    })

    temp.forEach(id => {
      if (this.toBePaid[id]) this.toBePaid[id] += amount / temp.length
      else this.toBePaid[id] = amount / temp.length
    })
  }

  final: any = []

  doTheDifference() {
    Object.keys(this.toBePaid).forEach(obj => {
      this.paidAlready[obj] -= this.toBePaid[obj]
    })

    Object.keys(this.paidAlready).forEach(id => {
      this.final.push({ name: this.names[id], amount: this.paidAlready[id] })
    })
  }

  expenseShared: any[] = []
  excludeExpensesPopup(event: { event: Event, excluded: Excluded[], expense_id: string }) {
    this.expenseShared = []
    this.sally?.members.forEach(member => {
      this.expenseShared.push({ id: member.id, name: member.name, included: true })
    })
    event.excluded.forEach((exclud) => {
      this.expenseShared.find((ex) => ex.id == exclud.member_id).included = false
    })
    this.confirmationService.confirm({
      target: event.event.target as EventTarget,
      accept: () => {
        const excluded_members = this.expenseShared.filter((member) => member.included == false)
        this.excludeMembers(excluded_members, event.expense_id)
      },
      reject: () => { }
    });
  }

  excludeMembers = (excluded_members: any, expense_id: string) => {
    this.apiService.exludeMembers(excluded_members, expense_id).subscribe({
      next: (res) => {
        this.getData()
      },
      error: (err) => {
        console.log(err)
      }
    })
  }



}
