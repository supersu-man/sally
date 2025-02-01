import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Expense, Sally } from '../interface/interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  headers = () => {
    return new HttpHeaders({ Authorization: "bruh!! get a life" })
  }

  createSally = (name: string) => {
    return this.httpClient.post(environment.endpoint + '/sally', { name }, { headers: this.headers() })
  }

  getSally = (id: string) => {
    return this.httpClient.get(environment.endpoint + '/sally', { params: { id }, headers: this.headers() })
  }

  updateSallyName = (id: string, name: string) => {
    return this.httpClient.patch(environment.endpoint + '/sally', { id, name }, { headers: this.headers() })
  }
  
  addMember = (name: string, sally_id: string) => {
    return this.httpClient.post(environment.endpoint + '/member', { name, sally_id }, { headers: this.headers() })
  }

  saveName = (sally_id: string, id: string, name: string) => {
    return this.httpClient.patch(environment.endpoint + '/member', { id, name, sally_id }, { headers: this.headers() })
  }

  deleteMember = (sally_id: string, id: string) => {
    return this.httpClient.delete(environment.endpoint + '/member', { body: { sally_id, id }, headers: this.headers() })
  }

  addExpense = (expenses: Expense[]) => {
    return this.httpClient.post(environment.endpoint + '/expense', expenses, { headers: this.headers() })
  }

  deleteExpense = (sally_id: string, member_id: string, id: string) => {
    return this.httpClient.delete(environment.endpoint + '/expense', { body: { sally_id, member_id, id }, headers: this.headers() })
  }

  exludeMembers = (excluded_members: any, expense_id: string) => {
    return this.httpClient.post(environment.endpoint + '/exclude-members', { excluded_members, expense_id }, { headers: this.headers() })
  }

}
