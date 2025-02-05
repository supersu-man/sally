import { Component, EventEmitter, Input, input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Excluded, Expense, Member } from 'src/app/interface/interface';

@Component({
  selector: 'app-member',
  imports: [CardModule, Button, InputTextModule, FormsModule],
  templateUrl: './member.component.html',
  styles: ``
})
export class MemberComponent implements OnInit {

  @Input() member!: Member;

  @Output() updateName = new EventEmitter<Member>()
  @Output() updateExpenses = new EventEmitter<Expense[]>()

  @Output() deleteExpense = new EventEmitter<Expense>()
  @Output() deleteMember = new EventEmitter<Member>()

  @Output() excludeExpensePopup = new EventEmitter<{event: Event, excluded: Excluded[], expense_id: string}>()

  memberCopy!: Member

  newExpenses: Expense[] = []

  ngOnInit(): void {
    if(this.member)
      this.memberCopy = structuredClone(this.member)
  }

  saveName() {
    console.log(this.member)
    this.updateName.emit(this.memberCopy)
  }

  modelChange = () => {
    const newExpenses = this.memberCopy.expenses.filter((expense) => { return expense.name != undefined && expense.amount != undefined })
    if(this.member.expenses.toString() != newExpenses.toString()) 
      this.newExpenses = newExpenses
    else 
      this.newExpenses = []
  }


  deletetheExpense = (expensePosition: number) => {
    const expense = this.memberCopy.expenses[expensePosition]
    if (!expense.id) {
      this.memberCopy.expenses.splice(expensePosition, 1)
      this.modelChange()
      return
    } else {
      this.deleteExpense.emit(expense)
    }
  }

  addTheExpense = () => {
    this.memberCopy.expenses.push({ id: undefined, name: undefined, amount: undefined, member_id: this.memberCopy.id, sally_id: this.memberCopy.sally_id, excluded: [] })
  }

  deleteTheMember = () => {
    this.deleteMember.emit(this.memberCopy)
  }
  updateTheExpenses = () => {
    this.updateExpenses.emit(this.newExpenses)
  }

  cancelUpdateExpenses = () => {
    this.memberCopy.expenses = [...this.memberCopy.expenses]
  }

  excludeExpensesPopup(event: Event, excluded: Excluded[], expense_id: string) {
    this.excludeExpensePopup.emit({event, excluded, expense_id})
  }

  

}
