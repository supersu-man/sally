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

  checkUser = (callback: (err: HttpErrorResponse | null) => void) => {
    this.httpClient.get(environment.endpoint + '/user', { headers: this.headers() }).subscribe({
      next: (value) => callback(null),
      error: (err: HttpErrorResponse) => callback(err)
    })
  }

  register = (callback: (err: HttpErrorResponse | null) => void) => {
    this.httpClient.post(environment.endpoint + '/user', {}, { headers: this.headers() }).subscribe({
      next: (res: any) => {
        callback(null)
      },
      error: (err) => {callback(err)}
    })
  }

  createSally = (name: string) => {
    return this.httpClient.post(environment.endpoint + '/sally', { name }, { headers: this.headers() })
  }

  getSally = (id: string) => {
    return this.httpClient.get(environment.endpoint + '/sally', { params: { id }, headers: this.headers() })
  }

  addMember = (name: string, sally_id: string) => {
    return this.httpClient.post(environment.endpoint + '/member', { name, sally_id }, { headers: this.headers() })
  }

  getSallys = (callback: (res: Sally[], err: HttpErrorResponse | null) => void) => {
    this.httpClient.get(environment.endpoint + '/sallys', { headers: this.headers() }).subscribe({
      next: (res) => callback(res as Sally[], null),
      error: (err) => callback([], err)
    })
  }

  


  deleteSally = (id: string, callback: (err: HttpErrorResponse | null) => void) => {
    this.httpClient.delete(environment.endpoint + '/sally', { body: { id }, headers: this.headers() }).subscribe({
      next: (res) => callback(null),
      error: (err) => callback(err)
    })
  }

  togglePrivacy = (id: string, privatee: boolean, callback: (sally: Sally | null, err: HttpErrorResponse | null) => void) => {
    this.httpClient.patch(environment.endpoint + '/sally/privacy', { id, private: privatee }, { headers: this.headers() }).subscribe({
      next: (res) => callback(res as Sally, null),
      error: (err) => callback(null, err)
    })
  }

  updateMembers = (id: string, members: string[], callback: (err: HttpErrorResponse | null) => void) => {
    this.httpClient.patch(environment.endpoint + '/sally/members', { id, members }, { headers: this.headers() }).subscribe({
      next: () => callback(null),
      error: (err) => callback(err)
    })
  }

  getExpenses = (id: string, callback: (expenses: Expense[], err: HttpErrorResponse | null) => void) => {
    this.httpClient.get(environment.endpoint + '/expense', { params: { id }, headers: this.headers() }).subscribe({
      next: (res) => callback(res as Expense[], null),
      error: (err) => callback([], err)
    })
  }

  addExpense = (data: { member: string, amount: number, desc: string, sally_id: string }, callback: (err: HttpErrorResponse | null) => void) => {
    this.httpClient.post(environment.endpoint + '/expense', data, { headers: this.headers() }).subscribe({
      next: (res) => callback(null),
      error: (err) => callback(err)
    })
  }

  deleteExpense = (id: string, callback: (err: HttpErrorResponse | null) => void) => {
    this.httpClient.delete(environment.endpoint + '/expense', { body: { id }, headers: this.headers() }).subscribe({
      next: (res) => callback(null),
      error: (err) => callback(err)
    })
  }


}
