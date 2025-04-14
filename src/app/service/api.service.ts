import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Expense, NewExpense, Sally } from '../interface/interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  signin = (googleToken: string) => {
    return this.httpClient.post(environment.endpoint + '/user/signin', { jwtToken: googleToken })
  }

  register = (googleToken: string) => {
    return this.httpClient.post(environment.endpoint + '/user/register', { jwtToken: googleToken })
  }

  getNewToken = (oldToken: string) => {
    return this.httpClient.post(environment.endpoint + "/user/token", { accessToken: oldToken })
  }

  createSally = (payload: { members: (String | null)[]; title: string | null; headcount: number | null }) => {
    return this.httpClient.post(environment.endpoint + '/sally', payload)
  }

  getSally = (id: string) => {
    return this.httpClient.get(environment.endpoint + '/sally', { params: { id } })
  }

  getSallys = () => {
    return this.httpClient.get(environment.endpoint + '/sally')
  }

  updateSallyName = (id: string, name: string) => {
    return this.httpClient.patch(environment.endpoint + '/sally', { id, name })
  }

  deleteSally = (id: string) => {
    return this.httpClient.delete(environment.endpoint + '/sally', { body: { id }})
  }
  
  addMember = (name: string, sally_id: string) => {
    return this.httpClient.post(environment.endpoint + '/member', { name, sally_id })
  }

  updateMemberName = (memberName: string, memeberId: string) => {
    return this.httpClient.patch(environment.endpoint + '/member', { id: memeberId, name: memberName })
  }

  deleteMember = (id: string) => {
    return this.httpClient.delete(environment.endpoint + '/member', { body: { id } })
  }

  addExpense = (expenses: NewExpense) => {
    return this.httpClient.post(environment.endpoint + '/expense', expenses)
  }

  updateExpense = (expense: Expense) => {
    return this.httpClient.patch(environment.endpoint + '/expense', expense)

  }

  deleteExpense = (id: string) => {
    return this.httpClient.delete(environment.endpoint + '/expense', { body: { id } })
  }

  exludeMembers = (excluded_members: any, expense_id: string) => {
    return this.httpClient.post(environment.endpoint + '/exclude-members', { excluded_members, expense_id } )
  }

}
