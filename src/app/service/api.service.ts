import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Expense, Sally } from '../interface/interface';

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

  createSally = (name: string) => {
    return this.httpClient.post(environment.endpoint + '/sally', { name })
  }

  getSally = (id: string) => {
    return this.httpClient.get(environment.endpoint + '/sally', { params: { id } })
  }

  updateSallyName = (id: string, name: string) => {
    return this.httpClient.patch(environment.endpoint + '/sally', { id, name })
  }
  
  addMember = (name: string, sally_id: string) => {
    return this.httpClient.post(environment.endpoint + '/member', { name, sally_id })
  }

  saveName = (sally_id: string, id: string, name: string) => {
    return this.httpClient.patch(environment.endpoint + '/member', { id, name, sally_id })
  }

  deleteMember = (sally_id: string, id: string) => {
    return this.httpClient.delete(environment.endpoint + '/member', { body: { sally_id, id } })
  }

  addExpense = (expenses: Expense[]) => {
    return this.httpClient.post(environment.endpoint + '/expense', expenses)
  }

  deleteExpense = (sally_id: string, member_id: string, id: string) => {
    return this.httpClient.delete(environment.endpoint + '/expense', { body: { sally_id, member_id, id } })
  }

  exludeMembers = (excluded_members: any, expense_id: string) => {
    return this.httpClient.post(environment.endpoint + '/exclude-members', { excluded_members, expense_id } )
  }

}
