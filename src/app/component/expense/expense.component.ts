import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ApiService } from 'src/app/service/api.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SliderModule } from 'primeng/slider';
import { DecimalPipe } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { Expense } from 'src/app/interface/interface';

interface ShareForm {
  id: FormControl<string | null>;
  share: FormControl<number | null>;
  amount: FormControl<number | null>;
  fixed: FormControl<boolean | null>;
}


@Component({
  selector: 'app-expense',
  imports: [InputTextModule, SelectModule, FormsModule, CheckboxModule, ButtonModule, RouterLink, ReactiveFormsModule, RadioButtonModule, SliderModule, DecimalPipe, DatePickerModule],
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
    id: new FormControl<string | null>(null),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    description: new FormControl<string | null>(null, Validators.required),
    paidBy: new FormControl<string | null>(null, Validators.required),
    date: new FormControl<Date | null>(new Date(), Validators.required),
    shares: new FormArray<FormGroup<ShareForm>>([]),
  })

  get shares(): FormArray<FormGroup<ShareForm>> {
    return this.expenseForm.get('shares') as FormArray<FormGroup<ShareForm>>;
  }

  members: { id: string, name: string, included: boolean }[] = []
  memberNameMap: Map<string, string> = new Map<string, string>()

  ngOnInit(): void {
    const group = this.apiService.getGroup(this.groupId)
    this.members = group.members.map((member) => ({ ...member, included: false }))
    this.members.forEach(member => {
      this.memberNameMap.set(member.id, member.name)
    })
    if (this.expenseId) {
      const expense = this.apiService.getExpense(this.groupId, this.expenseId)
      expense.date = new Date(expense.date)
      this.members.forEach(member => {
        const share = expense.shares.find(s => s.id === member.id)
        member.included = share !== undefined
      })
      const controls = expense.shares.map(share =>
        new FormGroup<ShareForm>({
          id: new FormControl<string>(share.id),
          share: new FormControl<number>(share.share),
          amount: new FormControl<number>(share.amount),
          fixed: new FormControl<boolean>(share.fixed),
        })
      );
      this.expenseForm.patchValue(expense)
      this.expenseForm.setControl('shares', new FormArray(controls));
    }
  }

  selectAll = () => {
    this.members.forEach(member => member.included = true)
    this.setShares()
  }

  atleastOneMemberIncluded = (): boolean => {
    return this.members.some(x => x.included)
  }

  addExpense = () => {
    const form = this.expenseForm.getRawValue() as Expense
    const id = form.id
    if (id) {
      this.apiService.updateExpense(form, this.groupId)
    } else {
      this.apiService.addExpense(form, this.groupId)
    }
    this.router.navigate(['/dashboard', this.groupId])
  }

  setShares() {
    const form = this.expenseForm.getRawValue();
    const amount = form.amount || 0;
    const included = this.members.filter(x => x.included);

    const controls = included.map(member =>
      new FormGroup<ShareForm>({
        id: new FormControl<string>(member.id),
        share: new FormControl<number>(100 / included.length),
        amount: new FormControl<number>(amount / included.length),
        fixed: new FormControl<boolean>(false),
      })
    );

    const newArray = new FormArray<FormGroup<ShareForm>>(controls);
    this.expenseForm.setControl('shares', newArray);
  }

  updateShares(index: number): void {
    const amount = this.expenseForm.getRawValue().amount ?? 0;
    const controls = this.shares.controls;

    const fixedControls = controls.filter(c => c.get('fixed')!.value);
    const fixedTotal = fixedControls.reduce((sum, c) => sum + (c.get('share')!.value ?? 0), 0);

    const current = controls[index];

    let currentShare = current.get('share')!.value ?? 0;
    const maxAllowed = 100 - fixedTotal;

    if (currentShare > maxAllowed) {
      currentShare = maxAllowed;
      current.get('share')!.setValue(currentShare, { emitEvent: false });
    }

    current.get('amount')!.setValue((currentShare / 100) * amount, { emitEvent: false });

    const editable = controls.filter((c, i) => i !== index && !c.get('fixed')!.value);
    if (editable.length === 0) return;

    const remaining = 100 - fixedTotal - currentShare;
    const perShare = remaining / editable.length;

    editable.forEach(c => {
      c.get('share')!.setValue(perShare, { emitEvent: false });
      c.get('amount')!.setValue((perShare / 100) * amount, { emitEvent: false });
    });
  }

  updateAmounts = () => {
    const amount = this.expenseForm.getRawValue().amount || 0
    this.shares.controls.forEach(x => {
      const share = x.get('share')!.value || 0
      x.get('amount')!.setValue(amount * share / 100)
    })
  }

  isFixedCheckboxDisabled(index: number): boolean {
    const control = this.shares.at(index);
    const isFixed = control.get('fixed')!.value;
    if (isFixed) return false;
    const unfixedCount = this.shares.controls.filter(c => !c.get('fixed')!.value).length;
    return unfixedCount <= 2;
  }

}
