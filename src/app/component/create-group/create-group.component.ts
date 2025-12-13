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
    name: new FormControl<string | null>(null, Validators.required),
    members: new FormControl<string[]>([]),
    thumbnail: new FormControl<string | null>(null, Validators.required)
  })

  createGroup = () => {
    if (this.groupForm.invalid) {
      return
    }
    const payload = this.groupForm.getRawValue() as { name: string, members: string[], thumbnail: string }
    const members = payload.members.map(m => { return { id: '', name: m.trim() } }).filter(member => member.name !== '')
    const id = this.apiService.createGroup({ ...payload, members, id: '', expenses: [] })
    this.router.navigate(['/dashboard', id])
  }

}
