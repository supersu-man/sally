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
  stats: any[] = []
  totalAmount = 0
  spinner = false

  tab_items: MenuItem[] = [
    { label: 'Expenses', icon: 'pi pi-fw pi-wallet' },
    { label: 'Stats', icon: 'pi pi-fw pi-calculator' }
  ]
  activeTabItem: MenuItem = this.tab_items[0]

  addExpensePopup = false
  popupSpinner = false
  expense_form = new FormGroup({
    member: new FormControl(null, Validators.required),
    amount: new FormControl(null, Validators.required),
    desc: new FormControl(null, Validators.required),
  })

  constructor(private route: ActivatedRoute, private messageService: MessageService, private commonService: CommonService, private httpClient: HttpClient) {
    this.commonService.header_subject.next(null)
    this.commonService.header_operation.subscribe((val) => {
      if (val == 'add') this.addExpensePopup = true
    })
    this.getData()
  }

  getData() {
    this.spinner = true
    this.httpClient.post(environment.endpoint + '/get-expenses', { sally_id: this.sally_id, user_id: this.user.id }).subscribe({
      next: (res: any) => {
        this.sally = res.sally
        this.expenses = res.expenses
        this.commonService.header_subject.next({ title: this.sally?.name, add: true, home: true })
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
      if(unq) unq.amount += expense.amount
      else this.stats.push({ member: expense.member, amount: expense.amount })
    })
    this.sally?.members.forEach((member: string) => {
      let unq = this.stats.find(stat => { return stat.member == member})
      if(!unq) this.stats.push({ member, amount: 0 })
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


}
