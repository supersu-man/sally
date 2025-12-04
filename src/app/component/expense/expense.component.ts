import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Expense } from 'src/app/interface/interface';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-expense',
  imports: [InputTextModule, SelectModule, FormsModule, CheckboxModule, ButtonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './expense.component.html',
  styles: ``
})
export class ExpenseComponent {

  apiService = inject(ApiService)
  route = inject(ActivatedRoute)
  router = inject(Router)

  groupId = this.route.snapshot.paramMap.get('groupId') as string
  expenseId = this.route.snapshot.paramMap.get('expenseId') as string | null

  expenseForm = new FormGroup({
    description: new FormControl<string | null>(null, Validators.required),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    member_id: new FormControl<string | null>(null, Validators.required),
  })
  members: { id: string, name: string, included: boolean }[] = []

  ngOnInit(): void {
    const group = this.apiService.getGroup(this.groupId)

    if (this.expenseId) {
      const member = group.members.find(m => m.expenses.some(e => e.id === this.expenseId));
      const expense = member?.expenses.find(e => e.id === this.expenseId);
      this.expenseForm.patchValue({
        description: expense?.description,
        amount: expense?.amount,
        member_id: member?.id
      })
      const excludedMemberIds = expense?.excluded
      this.members = group?.members.map(({ expenses, ...rest }) => ({ ...rest, included: !excludedMemberIds?.includes(rest.id) })) || []
    } else {
      this.members = group?.members.map(({ expenses, ...rest }) => ({ ...rest, included: false })) || []
    }
  }

  selectAll = () => {
    this.members.forEach(member => member.included = true)
  }

  atleastOneMemberIncluded = (): boolean => {
    return this.members.some(x => x.included)
  }

  addExpense = () => {
    const excludedMemberIds = this.members.filter(m => !m.included).map(m => m.id)
    const { member_id, ...rest } = this.expenseForm.value
    const expense = { ...rest, excluded: excludedMemberIds } as Expense
    if (this.expenseId) {
      this.apiService.updateExpense({ ...expense, id: this.expenseId }, this.groupId, member_id as string)
    } else {
      this.apiService.addExpense(expense, this.groupId, member_id as string)
    }

    this.router.navigate(['/dashboard', this.groupId])
  }
}
