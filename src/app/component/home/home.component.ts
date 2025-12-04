import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, RouterModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent { }