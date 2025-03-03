import { Routes } from '@angular/router';
import { AboutComponent } from './component/about/about.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { HomeComponent } from './component/home/home.component';
import { TermsComponent } from './component/terms/terms.component';
import { SallyComponent } from './component/sally/sally.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'sally/:sally_id', component: SallyComponent },
  
  { path: 'policy', component: TermsComponent },
  { path: 'about', component: AboutComponent }
];