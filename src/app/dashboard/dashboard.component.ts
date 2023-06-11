import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  add_sally_popup = false
  data = JSON.parse(localStorage.getItem("data") || "[]")
  current_slug: string | undefined
  items = [
    {
      label: 'Delete',
      icon: 'pi pi-fw pi-trash',
      command: () => {
        this.delete();
      }
    }
  ]

  sally_form = new FormGroup({
    slug: new FormControl(),
    name: new FormControl(Validators.required),
    members: new FormControl([]),
    expenses: new FormControl([])
  })

  constructor(private messageService: MessageService, private commonService: CommonService) {
    this.commonService.header_subject.next({ title: 'Dashboard', add: true })
    this.commonService.header_operation.subscribe((val) => {
      if (val == 'add') {
        this.sally_form.reset({ members: [], expenses: [] })
        this.add_sally_popup = true
      }
    })
  }

  create_sally = () => {
    let duplicates = (this.data as Array<any>).filter((v) => { return v.slug == this.slug(this.sally_form.get('name')?.value) })
    if (duplicates.length) return this.messageService.add({ severity: 'error', summary: 'Sally already exists' })
    this.sally_form.patchValue({ slug: this.slug(this.sally_form.get('name')?.value) })
    this.data.push(this.sally_form.getRawValue())
    localStorage.setItem("data", JSON.stringify(this.data))
    this.add_sally_popup = false
    this.messageService.add({ severity: 'success', summary: 'Sally created' })
  }

  total = (expenses: Array<any>) => { if (expenses && expenses.length != 0) return expenses.map(item => item.amount).reduce((prev, next) => prev + next) }

  delete = () => {
    this.data = this.data.filter((sally: any) => { return this.current_slug && sally.slug != this.current_slug })
    localStorage.setItem("data", JSON.stringify(this.data))
    this.current_slug = undefined
    this.messageService.add({ severity: 'success', summary: 'Sally deleted' })
  }

  slug = (name: any) => { return (name as string).toLowerCase().replaceAll(' ', '-') }

}
