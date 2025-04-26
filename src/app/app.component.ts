import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ ToastModule, RouterOutlet ],
  templateUrl: './app.component.html'
})
export class AppComponent {}