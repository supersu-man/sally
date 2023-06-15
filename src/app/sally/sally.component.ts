import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-sally',
  templateUrl: './sally.component.html'
})
export class SallyComponent {

  slug = this.route.snapshot.paramMap.get('sally') || ''
  data = JSON.parse(localStorage.getItem("data") || "[]")
  sally = this.data.find((v: any) => { return v.slug == this.slug })
  add_expense_popup = false

  tab_items: MenuItem[] = [
    { label: 'Expenses', icon: 'pi pi-fw pi-wallet' },
    { label: 'Stats', icon: 'pi pi-fw pi-calculator' }
  ]
  activeTabItem: MenuItem = this.tab_items[0]

  expense_form = new FormGroup({
    name: new FormControl(this.sally.members[0]),
    amount: new FormControl(Validators.required),
    reason: new FormControl(Validators.required),
    time: new FormControl()
  })

  constructor(private route: ActivatedRoute, private messageService: MessageService, private commonService: CommonService) {
    if (!this.sally) alert('Sally does not exist')
    this.commonService.header_subject.next({ title: this.sally.name, add: true , home: true})
    this.commonService.header_operation.subscribe((val) => {
      if(val == 'add') {
        this.expense_form.reset({ name: this.sally.members[0] })
        this.add_expense_popup = true
      }
    })
  }

  create_expense() {
    this.expense_form.patchValue({ time: new Date() })
    this.sally.expenses.push(this.expense_form.getRawValue())
    localStorage.setItem("data", JSON.stringify(this.data))
    this.add_expense_popup = false
    this.messageService.add({ severity: 'success', summary: 'Expense added' })
  }
  
  stats_array = () => {
    let obj: Array<any> = [];
    this.sally.expenses.forEach((expense: any) => {
      let unq = obj.find(v => { return v.name == expense.name })
      if(!unq) obj.push({ name: expense.name, amount: expense.amount })
      else unq.amount += expense.amount
    })
    this.sally.members.forEach((name: string) => {
      let unq = obj.find(v => { return v.name == name})
      if(!unq) obj.push({ name: name, amount: 0 })
    })
    return obj
  }

  getTotal = () => {
    if (this.sally.expenses.length == 0) return 0
    return this.sally.expenses.map((item: any) => item.amount).reduce((prev: any, next: any) => prev + next)
  }

}
