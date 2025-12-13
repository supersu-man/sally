import { Injectable } from '@angular/core';
import { Expense, Group, Member } from '../interface/interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private saveGroups(groups: Group[]) {
    localStorage.setItem('groups', JSON.stringify(groups))
  }

  getGroups = (): Group[] => {
    return JSON.parse(localStorage.getItem('groups') || '[]')
  }

  createGroup = (payload: Group) => {
    payload.id = uuidv4()
    payload.members = payload.members.map((member: Member) => ({ ...member, id: uuidv4() }))
    const groups = this.getGroups()
    groups.push(payload)
    this.saveGroups(groups)
    return payload.id
  }

  getGroup = (id: string) => {
    const groups = this.getGroups()
    return groups.find(group => group.id === id)!
  }

  updateGroupName = (id: string, name: string) => {
    const groups = this.getGroups()
    const index = groups.findIndex(group => group.id === id)
    groups[index].name = name
    this.saveGroups(groups)
  }

  deleteGroup = (id: string) => {
    const groups = this.getGroups()
    groups.splice(groups.findIndex(group => group.id === id), 1)
    this.saveGroups(groups)
  }

  updateMemberName = (memberName: string, groupId: string, memberId: string) => {
    const groups = this.getGroups()
    const groupIndex = groups.findIndex(group => group.id === groupId)
    const memberIndex = groups[groupIndex].members.findIndex(member => member.id === memberId)
    groups[groupIndex].members[memberIndex].name = memberName
    this.saveGroups(groups)
  }

  addExpense = (expense: Expense, groupId: string) => {
    const groups = this.getGroups()
    const groupIndex = groups.findIndex(group => group.id === groupId)
    expense.id = uuidv4()
    groups[groupIndex].expenses.push(expense)
    this.saveGroups(groups)
  }

  getExpense = (groupId: string, expenseId: string): Expense => {
    const groups = this.getGroups()
    const groupIndex = groups.findIndex(group => group.id === groupId)
    return groups[groupIndex].expenses.find(expense => expense.id === expenseId)!
  }

  updateExpense = (expense: Expense, groupId: string) => {
    const groups = this.getGroups()
    const groupIndex = groups.findIndex(group => group.id === groupId)
    const expenseIndex = groups[groupIndex].expenses.findIndex(exp => exp.id === expense.id)
    groups[groupIndex].expenses[expenseIndex] = expense
    this.saveGroups(groups)
  }

  deleteExpense = (id: string, groupId: string) => {
    const groups = this.getGroups()
    const groupIndex = groups.findIndex(group => group.id === groupId)
    const expenseIndex = groups[groupIndex].expenses.findIndex(exp => exp.id === id)
    groups[groupIndex].expenses.splice(expenseIndex, 1)
    this.saveGroups(groups)
  }

  getSettlements = (group: Group) => {
    const settlements = {} as { [key: string]: number }
    group.members.forEach(member => {
      settlements[member.id] = 0
    })
    group.expenses.forEach(expense => {
      settlements[expense.paidBy] += expense.amount
      expense.shares.forEach(share => {
        settlements[share.id] -= share.amount
      })
    })
    const paidMoreThanOwed = Object.entries(settlements).filter(([_, amount]) => amount > 0)
    const owedMoreThanPaid = Object.entries(settlements).filter(([_, amount]) => amount < 0)
    let i = 0
    let j = 0
    const finalSettlements = [] as { from: string, to: string, amount: number }[]
    while (i < paidMoreThanOwed.length && j < owedMoreThanPaid.length) {
      const [toId, toAmount] = paidMoreThanOwed[i]
      const [fromId, fromAmount] = owedMoreThanPaid[j] 
      const settlementAmount = Math.min(toAmount, -fromAmount)
      finalSettlements.push({ from: fromId, to: toId, amount: settlementAmount })
      paidMoreThanOwed[i][1] -= settlementAmount
      owedMoreThanPaid[j][1] += settlementAmount
      if (paidMoreThanOwed[i][1] === 0) i++
      if (owedMoreThanPaid[j][1] === 0) j++
    }
    return finalSettlements
  }

}
