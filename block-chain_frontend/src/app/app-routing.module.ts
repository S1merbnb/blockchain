import { NgModule, ViewChildren } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherWidgetComponent } from './public/weather-widget/weather-widget.component';
import { HowItWorksComponent } from './public/how-it-works/how-it-works.component';
import { HomeComponent } from './public/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { ContactUsComponent } from './public/contact-us/contact-us.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { BlockchainLogComponent } from './admin/blockchain-log/blockchain-log.component';
import { PendingEventsComponent } from './admin/pending-events/pending-events.component';
import { ReportsComponent } from './admin/reports/reports.component';
import { CreateFarmComponent } from './admin/create-farm/create-farm.component';
import { RegisterComponent } from './auth/register/register.component';
import { RoleGuard } from './shared/guards/role.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: 'weather-widget', component: WeatherWidgetComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'dashboard', component: DashboardComponent , canActivateChild: [RoleGuard], data: { allowedRoles: ['ADMIN','SUPERADMIN'] }, children: [
    { path: 'pending-events', component: PendingEventsComponent , data: { allowedRoles: ['ADMIN','SUPERADMIN'] }},
    { path: 'blockchain-log', component: BlockchainLogComponent , data: { allowedRoles: ['ADMIN','SUPERADMIN'] }},
    { path: 'reports', component: ReportsComponent , data: { allowedRoles: ['ADMIN','SUPERADMIN'] }},
    { path: 'create-farm', component: CreateFarmComponent, data: { allowedRoles: ['ADMIN','SUPERADMIN'] } },
    { path: 'register', component: RegisterComponent, data: { allowedRoles: ['SUPERADMIN'] } }
  ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
 }
