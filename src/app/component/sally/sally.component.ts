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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CheckboxModule } from 'primeng/checkbox';
import { MemberComponent } from "../common/member/member.component";
import { DecimalPipe } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UtilService } from 'src/app/service/util.service';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-sally',
  imports: [ToolbarModule, ContextMenuModule,ConfirmDialogModule, ButtonModule, ProgressSpinnerModule, DialogModule, FormsModule, RouterModule, InputTextModule, CardModule, ConfirmPopupModule, CheckboxModule, MemberComponent, DecimalPipe, TableModule],
  templateUrl: './sally.component.html',
  styles: ``,
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

  expenseSharedPopup = false
  expenseSharedPopupButtonEnabled = true
  expenseShared: any[] = []
  expense_id: string = ''

  constructor(private route: ActivatedRoute, 
    private messageService: MessageService, 
    private apiService: ApiService, 
    private router: Router, 
    private utilService: UtilService) { }

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

  private deleteSally = () => {
    this.apiService.deleteSally(this.sally?.id as string).subscribe({
      next: (res) => {
        this.router.navigate(["/dashboard"])
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Successfully deleted sally' })
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to delete sally' })
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

  openSharedExpensesPopup(event: { event: Event, excluded: Excluded[], expense_id: string }) {
    if(!this.sally) return
    this.expense_id = event.expense_id
    const s: any[] = this.sally.members.map((m) => { return { ...m, included: true} })
    event.excluded.forEach((exclud) => {
      s.find((ex) => ex.id == exclud.member_id).included = false
    })
    this.expenseShared = s
    this.expenseSharedPopup = true
  }

  sharedExpensesOnModelChange = () => {
    const included = this.expenseShared.filter((x) => x.included == true)
    this.expenseSharedPopupButtonEnabled = included.length > 1
  }

  excludeMembers = (excluded_members: any, expense_id: string) => {
    let s = excluded_members.filter((m: any) => m.included == false)
    s = s.map((m: any) => { return m.id })
    this.apiService.exludeMembers(s, expense_id).subscribe({
      next: (res) => {
        this.expenseSharedPopup = false
        this.getData()
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  deleteSallyConfirmPopup(event: Event) {
    this.utilService.confirmDialog(
      event,
      "Delete sally?",
      "Are you sure you want to delete the sally?",
      this.deleteSally
    )
  }

}
