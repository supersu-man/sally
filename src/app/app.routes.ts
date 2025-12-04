import { Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { HomeComponent } from './component/home/home.component';
import { CreateGroupComponent } from './component/create-group/create-group.component';
import { GroupComponent } from './component/group/group.component';
import { ExpenseComponent } from './component/expense/expense.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/create-group', component: CreateGroupComponent },
  { path: 'dashboard/:groupId', component: GroupComponent },
  { path: 'dashboard/:groupId/add-expense', component: ExpenseComponent },
  { path: 'dashboard/:groupId/:expenseId', component: ExpenseComponent }
];