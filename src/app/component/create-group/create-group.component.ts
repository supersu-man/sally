import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from "@angular/router";
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-create-group',
  imports: [InputTextModule, AutoCompleteModule, ButtonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-group.component.html',
  styles: ``
})
export class CreateGroupComponent {

  apiService = inject(ApiService)
  router = inject(Router)

  thumbnails = [
    "thumbnail_1.jpg",
    "thumbnail_2.jpg",
    "thumbnail_3.jpg",
    "thumbnail_4.jpg",
    "thumbnail_5.jpg",
    "thumbnail_6.jpg"
  ]

  groupForm = new FormGroup({
    title: new FormControl<string | null>(null, Validators.required),
    members: new FormControl<string[]> ([]),
    thumbnail: new FormControl<string | null>(null, Validators.required)
  })

  createGroup = () => {
    if(this.groupForm.invalid) {
      return
    }
    const formValue = this.groupForm.getRawValue() as { title: string, members: string[], thumbnail: string }
    formValue.members = formValue.members.map(m => m.trim()).filter(name => name !== '')
    const members = formValue.members.map(name => ({ name, expenses: [] }))
    const payload = { name: formValue.title, members: members, thumbnail: formValue.thumbnail }
    const id = this.apiService.createGroup(payload)
    this.router.navigate(['/dashboard', id])
  }

}
