import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SallyComponent } from './sally/sally.component';
import { commonGuard } from './guard/common.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [commonGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [commonGuard] },
  { path: 'dashboard/:sally_id', component: SallyComponent, canActivate: [commonGuard] },
  { path: 'sallys/:sally_id', component: SallyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
