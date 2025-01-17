import { Routes } from '@angular/router';
import { AboutComponent } from './component/about/about.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { HomeComponent } from './component/home/home.component';
import { TermsComponent } from './component/terms/terms.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: ':sally_id', component: DashboardComponent },
  
  { path: 'policy', component: TermsComponent },
  { path: 'about', component: AboutComponent }
];