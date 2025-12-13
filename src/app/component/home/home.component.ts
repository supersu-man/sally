import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, RouterModule],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent { }