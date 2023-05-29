import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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
    slug: new FormControl({ value: '', disabled: true }),
    name: new FormControl(''),
    members: new FormControl([]),
    expenses: new FormControl([])
  })

  constructor() { }

  create_sally() {
    console.log(this.sally_form.getRawValue())
    let duplicates = (this.data as Array<any>).filter((v) => { return v.slug == this.sally_form.get('slug')?.value })
    if (duplicates.length) return alert('Sally already exists')
    this.data.push(this.sally_form.getRawValue())
    localStorage.setItem("data", JSON.stringify(this.data))
    this.add_sally_popup = false
    alert('Sally created')
  }

  total = (expenses: Array<any>) => { if (expenses.length != 0) return expenses.map(item => item.amount).reduce((prev, next) => prev + next) }


  slug = () => this.sally_form.patchValue({ slug: this.sally_form.get('name')?.value?.toLowerCase().replaceAll(' ', '-') })

}
