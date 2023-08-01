import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { CommonService } from '../service/common.service';
import { Expense, MyUser, Sally, Stat } from '../interface/interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sally',
  templateUrl: './sally.component.html'
})
export class SallyComponent {

  sally_id = this.route.snapshot.paramMap.get('sally_id')
  user = JSON.parse(localStorage.getItem('user') as string) as MyUser

  sally: Sally | undefined
  expenses: Expense[] = []

  stats: Stat[] = []
  totalAmount = 0

  spinner = false

  items = [{
    label: 'Delete',
    icon: 'pi pi-fw pi-trash',
    command: () => { this.deleteExpense() }
  }]
  selectedExpense: Expense | undefined

  tab_items: MenuItem[] = [
    { label: 'Expenses', icon: 'pi pi-fw pi-wallet' },
    { label: 'Stats', icon: 'pi pi-fw pi-calculator' },
    { label: 'Members', icon: 'pi pi-fw pi-user' }
  ]
  activeTabItem: MenuItem = this.tab_items[0]

  addExpensePopup = false
  popupSpinner = false
  expense_form = new FormGroup({
    member: new FormControl(null, Validators.required),
    amount: new FormControl(null, Validators.required),
    desc: new FormControl(null, Validators.required),
  })

  addMemberPopup = false
  member_form = new FormGroup({
    members : new FormControl()
  })

  constructor(private route: ActivatedRoute, private messageService: MessageService, private commonService: CommonService, private httpClient: HttpClient) {
    this.commonService.header_subject.next(null)
    this.commonService.header_operation.subscribe((val) => {
      if (val == 'addExpense') this.addExpensePopup = true
      if (val == 'addMember') this.addMemberPopup = true
    })
    this.getData()
  }

  getData() {
    this.spinner = true
    this.httpClient.post(environment.endpoint + '/get-expenses', { sally_id: this.sally_id, user_id: this.user.id }).subscribe({
      next: (res: any) => {
        this.sally = res.sally
        this.expenses = res.expenses
        this.member_form.patchValue({ members: this.sally?.members })
        this.commonService.header_subject.next({ title: this.sally?.name, addExpense: true, addMember:true, home: true })
        this.makeStats()
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
        console.log(err)
      },
      complete: () => { this.spinner = false }
    })
  }

  makeStats() {
    this.stats = []
    this.totalAmount = 0
    this.expenses.forEach((expense: Expense) => {
      this.totalAmount += expense.amount
      let unq = this.stats.find(stat => { return stat.member == expense.member })
      if (unq) unq.amount += expense.amount
      else this.stats.push({ member: expense.member, amount: expense.amount })
    })
    this.sally?.members.forEach((member: string) => {
      let unq = this.stats.find(stat => { return stat.member == member })
      if (!unq) this.stats.push({ member, amount: 0 })
    })
  }

  create_expense() {
    this.popupSpinner = true
    this.httpClient.post(environment.endpoint + '/create-expense', { ...this.expense_form.getRawValue(), sally_id: this.sally_id, user_id: this.user.id }).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Expense added' })
        this.getData()
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
        console.log(err)
      },
      complete: () => {
        this.popupSpinner = false
        this.addExpensePopup = false
      }
    })
  }

  deleteExpense() {
    this.spinner = true
    this.httpClient.post(environment.endpoint + '/delete-expense', { expense_id: this.selectedExpense?.id, user_id: this.user.id }).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Expense deleted' })
        this.getData()
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
        console.log(err)
      },
      complete: () => {
        this.spinner = false
        this.addExpensePopup = false
      }
    })
  }

  updateMembers() {
    this.popupSpinner = true
    this.httpClient.post(environment.endpoint+'/update-members', {...this.member_form.getRawValue(), sally_id: this.sally_id, user_id: this.user.id }).subscribe({
      next: (sally) => {
        console.log(sally)
        this.sally = sally as Sally
        this.popupSpinner = false
        this.addMemberPopup = false
        this.activeTabItem = this.tab_items[2]
      },
      error: (err) => {
        console.log(err)
        this.popupSpinner = false
      }
    })
  }


}
