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
  group: Group | undefined
  stats: {from: string, to: string, amount: number}[] = []

  deleteExpenseId: string = ''

  memberDialog: boolean = false
  memberForm = new FormGroup({
    id: new FormControl<string | null>(null, Validators.required),
    name: new FormControl<string | null>(null, Validators.required)
  })

  ngOnInit(): void {
    this.getData()
  }

  getData = () => {
    this.group = this.apiService.getGroup(this.groupId)
    const namemap = {} as {[key: string]: string}
    this.group.members.forEach(member => namemap[member.id] = member.name)
    this.stats = this.apiService.getSettlements(this.group)
    this.stats.forEach(settlement => {
      settlement.from = namemap[settlement.from]
      settlement.to = namemap[settlement.to]
    })
  }

  deleteExpenseConfirmPopup(event: Event, expenseId: string) {
    this.deleteExpenseId = expenseId
    this.utilService.confirmDialog(
      event,
      "Delete expense?",
      "Are you sure you want to delete the expense?",
      this.deleteExpense
    )
  }

  saveMember = () => {
    if (this.memberForm.invalid) return
    const form = this.memberForm.getRawValue()
    this.apiService.updateMemberName(form.name || '', this.groupId, form.id || '')
    this.getData()
    this.memberDialog = false
  }

  private deleteExpense = () => {
    this.apiService.deleteExpense(this.deleteExpenseId, this.groupId)
    this.getData()
  }

}
