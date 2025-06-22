import { Routes } from '@angular/router';
import { AboutComponent } from './component/about/about.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { HomeComponent } from './component/home/home.component';
import { TermsComponent } from './component/terms/terms.component';
import { SallyComponent } from './component/sally/sally.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'dashboard/:sally_id', component: SallyComponent, canActivate: [authGuard] },
  
  { path: 'policy', component: TermsComponent },
  { path: 'about', component: AboutComponent }
];