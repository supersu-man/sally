import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Excluded, Expense, Member, NewExpense, Sally } from 'src/app/interface/interface';
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

@Component({
  selector: 'app-sally',
  imports: [ToolbarModule, ContextMenuModule, ButtonModule, ProgressSpinnerModule, DialogModule, FormsModule, RouterModule, InputTextModule, CardModule, ConfirmPopupModule, CheckboxModule, MemberComponent],
  templateUrl: './sally.component.html',
  styles: ``
})
export class SallyComponent implements OnInit {

  sally_id = this.route.snapshot.paramMap.get('sally_id') as string
  sally: Sally | undefined
  stats: any

  spinner = false

  totalExpenses = 0

  
  name = ''
  namePopup = false
  popupType : 'sally_name' | 'member_name' = 'sally_name'


  constructor(private route: ActivatedRoute, private messageService: MessageService, private apiService: ApiService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.getData()
  }

  openSallyNamePopup = () => {
    this.name = this.sally?.name as string
    this.popupType = 'sally_name'
    this.namePopup = true
  }

  openMemberNamePopup = () => {
    this.popupType = 'member_name'
    this.namePopup = true
  }

  getData = () => {
    this.spinner = true
    this.apiService.getSally(this.sally_id).subscribe({
      next: (res: any) => {
        console.log(res)
        this.sally = res.sally
        this.stats = res.stats

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
        this.namePopup = false
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
        this.namePopup = false
        this.getData()
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    })
  }

  expenseShared: any[] = []
  excludeExpensesPopup(event: { event: Event, excluded: Excluded[], expense_id: string }) {
    console.log()
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
