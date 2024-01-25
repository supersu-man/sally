import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { CommonService } from '../service/common.service';
import { Expense, User, Sally, Stat } from '../interface/interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sally',
  templateUrl: './sally.component.html'
})
export class SallyComponent {

  sally_id = this.route.snapshot.paramMap.get('sally_id')

  sally: Sally | undefined
  spinner = false

  stats: Stat[] = []
  totalAmount = 0

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

  popupSpinner = false
  expense_form = new FormGroup({
    member: new FormControl(null, Validators.required),
    amount: new FormControl(null, Validators.required),
    desc: new FormControl(null, Validators.required),
  })

  member_form = new FormGroup({
    members: new FormControl()
  })

  constructor(private router: Router, private route: ActivatedRoute, private messageService: MessageService, public commonService: CommonService, private httpClient: HttpClient, private confirmationService: ConfirmationService) {
    console.log('compo')
    this.getSally()
    commonService.togglePrivacy = () => {
      this.privacyConfirmation()
    }

  }

  getSally() {
    this.spinner = true
    const headers = new HttpHeaders({ 'Authorization': this.commonService.accessToken as string })
    this.httpClient.get(environment.endpoint + '/sally/' + this.sally_id, { headers }).subscribe({
      next: (sally) => {
        this.sally = sally as Sally
        this.commonService.heading = this.sally.name
        this.member_form.patchValue({ members: this.sally.members })
        if (this.sally.user_id != this.commonService.user?.id) this.router.navigate(['/sallys/' + this.sally?.id])
        this.makeStats()
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
        console.log(err)
      }
    }).add(() => { this.spinner = false})
  }

  togglePrivacy() {
    const headers = new HttpHeaders({ 'Authorization': this.commonService.accessToken as string })
    this.httpClient.put(environment.endpoint + '/privacy', { sally_id: this.sally_id, private: !this.sally?.private }, { headers }).subscribe({
      next: (sally: any) => {
        if (this.sally) this.sally.private = sally.private
        this.messageService.add({ severity: 'success', summary: sally.private ? 'Sharing disabled' : 'Sharing enabled and Link copied' })
        if (!sally.private) { navigator.clipboard.writeText(window.location.origin + '/sallys/' + this.sally?.id) }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
        console.log(err)
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
    const headers = new HttpHeaders({ 'Authorization': this.commonService.accessToken as string })
    this.httpClient.post(environment.endpoint + '/expense', { ...this.expense_form.getRawValue(), sally_id: this.sally_id }, { headers }).subscribe({
      next: (expense) => {
        this.getSally()
        this.commonService.addExpensePopop = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
        console.log(err)
      }
    }).add(() => this.popupSpinner = false)
  }

  deleteExpense() {
    const headers = new HttpHeaders({ 'Authorization': this.commonService.accessToken as string })
    this.httpClient.delete(environment.endpoint + '/expense', { body: { expense_id: this.selectedExpense?.id }, headers }).subscribe({
      next: (res) => {
        this.getSally()
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
        console.log(err)
      }
    })
  }

  updateMembers() {
    this.popupSpinner = true
    const headers = new HttpHeaders({ 'Authorization': this.commonService.accessToken as string })
    this.httpClient.put(environment.endpoint + '/members', { ...this.member_form.getRawValue(), sally_id: this.sally_id }, { headers }).subscribe({
      next: (sally) => {
        if(this.sally) this.sally.members = (sally as Sally).members
        this.activeTabItem = this.tab_items[2]
        this.makeStats()
        this.commonService.addMemeberPopup = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error has occured' })
        console.log(err)
      }
    }).add(() => this.popupSpinner = false)
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
