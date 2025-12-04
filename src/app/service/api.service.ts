import { Injectable } from '@angular/core';
import { Expense, Group } from '../interface/interface';
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

  createGroup = (payload: any) => {
    payload.id = uuidv4()
    payload.members = payload.members.map((member: any) => ({ ...member, id: uuidv4() }))
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

  addMember = (name: string, groupId: string) => {
    const groups = this.getGroups()
    const index = groups.findIndex(group => group.id === groupId)
    groups[index].members.push({ id: uuidv4(), name, expenses: [] })
    this.saveGroups(groups)
  }

  updateMemberName = (memberName: string, groupId: string, memberId: string) => {
    const groups = this.getGroups()
    const groupIndex = groups.findIndex(group => group.id === groupId)
    const memberIndex = groups[groupIndex].members.findIndex(member => member.id === memberId)
    groups[groupIndex].members[memberIndex].name = memberName
    this.saveGroups(groups)
  }

  deleteMember = (id: string, groupId: string) => {
    const groups = this.getGroups()
    const groupIndex = groups.findIndex(group => group.id === groupId)
    groups[groupIndex].members.splice(groups[groupIndex].members.findIndex(member => member.id === id), 1)
    this.saveGroups(groups)
  }

  addExpense = (expense: Expense, groupId: string, memberId: string) => {
    const groups = this.getGroups()
    const groupIndex = groups.findIndex(group => group.id === groupId)
    const memberIndex = groups[groupIndex].members.findIndex(member => member.id === memberId)
    groups[groupIndex].members[memberIndex].expenses.push({ ...expense, id: uuidv4() })
    this.saveGroups(groups)
  }

  updateExpense = (expense: Expense, groupId: string, memberId: string) => {
    const groups = this.getGroups()
    const groupIndex = groups.findIndex(group => group.id === groupId)
    const memberIndex = groups[groupIndex].members.findIndex(member => member.id === memberId)
    const expenseIndex = groups[groupIndex].members[memberIndex].expenses.findIndex(exp => exp.id === expense.id)
    groups[groupIndex].members[memberIndex].expenses[expenseIndex] = expense
    this.saveGroups(groups)
  }

  deleteExpense = (id: string, groupId: string, memberId: string) => {
    const groups = this.getGroups()
    const groupIndex = groups.findIndex(group => group.id === groupId)
    const memberIndex = groups[groupIndex].members.findIndex(member => member.id === memberId)
    const expenseIndex = groups[groupIndex].members[memberIndex].expenses.findIndex(exp => exp.id === id)
    groups[groupIndex].members[memberIndex].expenses.splice(expenseIndex, 1)
    this.saveGroups(groups)
  }

  excludeMembers = (excluded_members: string[], groupId: string, memberId: string, expenseId: string,) => {
    const groups = this.getGroups()
    const groupIndex = groups.findIndex(group => group.id === groupId)
    const memberIndex = groups[groupIndex].members.findIndex(member => member.id === memberId)
    const expenseIndex = groups[groupIndex].members[memberIndex].expenses.findIndex(exp => exp.id === expenseId)
    groups[groupIndex].members[memberIndex].expenses[expenseIndex].excluded = excluded_members
    this.saveGroups(groups)
  }

  getSettlements = (group: Group) => {
    const memberObjs: { [key: string]: { name: string, totalPaid: number, totalShare: number } } = {}
    group.members.forEach(member => {
      if (!memberObjs[member.id]) memberObjs[member.id] = { name: member.name, totalPaid: 0, totalShare: 0 }
      member.expenses.forEach(expense => {
        memberObjs[member.id].totalPaid += expense.amount
        const includedMembers = group.members.filter(m => !expense.excluded.includes(m.id))
        const share = expense.amount / includedMembers.length
        includedMembers.forEach(m => {
          if (!memberObjs[m.id]) memberObjs[m.id] = { name: m.name, totalPaid: 0, totalShare: 0 }
          memberObjs[m.id].totalShare += share
        })
      })
    })
    const settlements: { from: string, to: string, amount: number }[] = []
    const paidMore: { memberId: string; amount: number; }[] = []
    const paidLess: { memberId: string; amount: number; }[] = []
    Object.keys(memberObjs).forEach(key => {
      const net = parseFloat((memberObjs[key].totalPaid - memberObjs[key].totalShare).toFixed(2))
      if (net > 0) {
        paidMore.push({ memberId: key, amount: net })
      } else if (net < 0) {
        paidLess.push({ memberId: key, amount: -net })
      }
    })
    while (paidMore.length > 0 && paidLess.length > 0) {
      const more = paidMore[0]
      const less = paidLess[0]
      const transferAmount = Math.min(more.amount, less.amount)
      settlements.push({ from: memberObjs[less.memberId].name, to: memberObjs[more.memberId].name, amount: transferAmount })
      more.amount -= transferAmount
      less.amount -= transferAmount
      if (more.amount == 0) {
        paidMore.shift()
      }
      if (less.amount == 0) {
        paidLess.shift()
      }
    }
    return settlements
  }

}
