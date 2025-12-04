import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ ToastModule, RouterOutlet, ConfirmDialog ],
  templateUrl: './app.component.html'
})
export class AppComponent {}