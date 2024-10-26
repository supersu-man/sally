import { Component } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ChipsModule } from 'primeng/chips';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { Sally, Stat, Expense } from 'src/app/interface/interface';
import { ApiService } from 'src/app/service/api.service';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-sally',
  standalone: true,
  imports: [ ToolbarModule, DropdownModule, CommonModule, TabMenuModule, InputNumberModule, ContextMenuModule, ButtonModule, ProgressSpinnerModule, DialogModule, ChipsModule, ReactiveFormsModule, InputTextModule ],
  templateUrl: './sally.component.html',
  styles: ``
})
export class SallyComponent {

  sally_id = this.route.snapshot.paramMap.get('sally_id') as string
  sally: Sally | undefined
  spinner = false

  stats: Stat[] = []
  totalAmount = 0

  selectedExpense: Expense | undefined
  context_items = [{
    label: 'Delete',
    icon: 'pi pi-fw pi-trash',
    command: () => { this.deleteExpense() }
  }]

  tab_items: MenuItem[] = [
    { label: 'Expenses', icon: 'pi pi-fw pi-wallet' },
    { label: 'Stats', icon: 'pi pi-fw pi-calculator' },
    { label: 'Members', icon: 'pi pi-fw pi-user' }
  ]
  activeTabItem: MenuItem = this.tab_items[0]

  popupSpinner = false

  addExpensePopop = false
  expense_form = new FormGroup({
    member: new FormControl<string | null>(null, Validators.required),
    amount: new FormControl<number | null>(null, Validators.required),
    desc: new FormControl<string | null>(null, Validators.required),
  })

  addMemeberPopup = false
  member_form = new FormGroup({
    members: new FormControl()
  })

  constructor(private router: Router, private route: ActivatedRoute, private messageService: MessageService, public apiService: ApiService, private httpClient: HttpClient, private confirmationService: ConfirmationService) {
    this.getSally()
  }

  getSally() {
    this.spinner = true
    this.apiService.getSally(this.sally_id as string, (sally, err) => {
      if(err) {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
      } else {
        this.sally = sally as Sally
        this.member_form.patchValue({ members: this.sally.members })
        this.makeStats()
      }
      this.spinner = false
    })
  }

  togglePrivacy() {
    this.spinner = true
    this.apiService.togglePrivacy(this.sally_id as string, !this.sally?.private, (sally, err) => {
      this.spinner = false
      if(err) {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
      } else {
        (this.sally as Sally).private = !this.sally?.private
        this.messageService.add({ severity: 'success', summary: this.sally?.private ? 'Sharing disabled' : 'Sharing enabled and Link copied' })
        if (!sally?.private) { navigator.clipboard.writeText(window.location.host + '/' + this.sally?.id) }
      }
    })
  }

  makeStats() {
    this.stats = []
    this.totalAmount = 0
    this.sally?.expenses?.forEach((expense: Expense) => {
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

  createExpense() {
    this.popupSpinner = true
    const body = {
      sally_id: this.sally_id,
      member: this.expense_form.getRawValue().member as string,
      amount: this.expense_form.getRawValue().amount as number,
      desc: this.expense_form.getRawValue().desc as string
    }
    this.apiService.addExpense(body, (err) => {
      if(err) {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
      } else {
        this.messageService.add({ severity: 'success', summary: 'Expense created' })
        this.getSally()
      }
      this.addExpensePopop = false
      this.popupSpinner = false
    })
  }

  deleteExpense() {
    this.spinner = true
    this.apiService.deleteExpense(this.selectedExpense?.id as string, (err) => {
      this.spinner = false
      if(err) {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
      } else {
        this.messageService.add({ severity: 'success', summary: 'Expense deleted' })
        this.getSally()
      }
    })
  }

  updateMembers() {
    this.popupSpinner = true
    this.apiService.updateMembers(this.sally_id, this.member_form.getRawValue().members, (err) => {
      if(err) {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
      } else {
        this.getSally()
      }
      this.addMemeberPopup = false
      this.popupSpinner = true
    })
  }

  privacyConfirmation() {
    this.confirmationService.confirm({
      message: `Are you sure you want to change it to ${this.sally?.private ? 'PUBLIC' : 'PRIVATE'} sally?`,
      header: 'Toggle privacy',
      icon: 'pi pi-exclamation-triangle',
      accept: () => { this.togglePrivacy() },
      reject: () => { }
    })
  }

}
