import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Group } from 'src/app/interface/interface';
import { ApiService } from 'src/app/service/api.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DecimalPipe } from '@angular/common';
import { UtilService } from 'src/app/service/util.service';

@Component({
  selector: 'app-group',
  imports: [BreadcrumbModule, RouterLink, ButtonModule, TableModule, DecimalPipe],
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

  constructor() {
    this.group = this.apiService.getGroup(this.groupId)
    this.stats = this.apiService.getSettlements(this.group)
  }

  getData = () => {
    this.group = this.apiService.getGroup(this.groupId)
    this.stats = this.apiService.getSettlements(this.group)
    console.log(this.group)
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

  private deleteExpense = () => {
    this.apiService.deleteExpense(this.deleteExpenseId, this.groupId, this.deleteMemberId)
    this.getData()
  }

}
