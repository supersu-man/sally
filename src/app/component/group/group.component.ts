import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Group } from 'src/app/interface/interface';
import { ApiService } from 'src/app/service/api.service';
import { ButtonModule } from 'primeng/button';
import { DecimalPipe } from '@angular/common';
import { UtilService } from 'src/app/service/util.service';
import { DialogModule } from 'primeng/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-group',
  imports: [RouterLink, ButtonModule, DecimalPipe, DialogModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './group.component.html',
  styles: ``
})
export class GroupComponent {

  apiService = inject(ApiService)
  route = inject(ActivatedRoute)
  utilService = inject(UtilService)

  groupId = this.route.snapshot.paramMap.get('groupId') as string
  group: Group
  stats: any

  deleteExpenseId: string = ''
  deleteMemberId: string = ''

  memberDialog = false
  memberForm = new FormGroup({
    id: new FormControl<string | null>(null),
    name: new FormControl<string | null>(null, Validators.required)
  })

  constructor() {
    this.group = this.apiService.getGroup(this.groupId)
    this.stats = this.apiService.getSettlements(this.group)
  }

  getData = () => {
    this.group = this.apiService.getGroup(this.groupId)
    this.stats = this.apiService.getSettlements(this.group)
  }

  deleteExpenseConfirmPopup(event: Event, expenseId: string, memberId: string) {
    this.deleteExpenseId = expenseId
    this.deleteMemberId = memberId
    this.utilService.confirmDialog(
      event,
      "Delete expense?",
      "Are you sure you want to delete the expense?",
      this.deleteExpense
    )
  }

  deleteMemberConfirmPopup(event: Event, memberId: string) {
    this.deleteMemberId = memberId
    this.utilService.confirmDialog(
      event,
      "Delete member?",
      "Are you sure you want to delete the member?",
      this.deleteMember
    )
  }

  saveMember = () => {
    const form = this.memberForm.getRawValue()
    if (!form.name) return
    if (!form.id) this.apiService.addMember(form.name, this.groupId)
    else this.apiService.updateMemberName(form.name, this.groupId, form.id)
    this.getData()
    this.memberDialog = false
  }

  private deleteExpense = () => {
    this.apiService.deleteExpense(this.deleteExpenseId, this.groupId, this.deleteMemberId)
    this.getData()
  }

  private deleteMember = () => {
    this.apiService.deleteMember(this.deleteMemberId, this.groupId)
    this.getData()
  }

}
