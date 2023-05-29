import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  add_sally_popup = false
  data = JSON.parse(localStorage.getItem("data") || "[]")
  current_slug = ''

  sally_form = new FormGroup({
    slug: new FormControl(''),
    name: new FormControl('', Validators.required),
    members: new FormControl([]),
    expenses: new FormControl([])
  })

  constructor() {
    console.log(this.data)
   }

  create_sally() {
    let duplicates = (this.data as Array<any>).filter((v) => { return v.slug == this.slug(this.sally_form.get('name')?.value) })
    if (duplicates.length) return alert('Sally already exists')
    this.sally_form.patchValue({ slug: this.slug(this.sally_form.get('name')?.value) })
    this.data.push(this.sally_form.getRawValue())
    localStorage.setItem("data", JSON.stringify(this.data))
    this.add_sally_popup = false
    alert('Sally created')
  }

  total = (expenses: Array<any>) => { if (expenses && expenses.length != 0) return expenses.map(item => item.amount).reduce((prev, next) => prev + next) }


  slug = (name: any) => { return (name as string).toLowerCase().replaceAll(' ', '-') }

}
