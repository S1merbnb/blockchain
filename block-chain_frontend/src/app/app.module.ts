import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './public/home/home.component';
import { HowItWorksComponent } from './public/how-it-works/how-it-works.component';
import { WeatherWidgetComponent } from './public/weather-widget/weather-widget.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LoginComponent } from './auth/login/login.component';
import { ContactUsComponent } from './public/contact-us/contact-us.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { PendingEventsComponent } from './admin/pending-events/pending-events.component';
import { BlockchainLogComponent } from './admin/blockchain-log/blockchain-log.component';
import { ReportsComponent } from './admin/reports/reports.component';
import { CreateFarmComponent } from './admin/create-farm/create-farm.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HowItWorksComponent,
    WeatherWidgetComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    ContactUsComponent,
    DashboardComponent,
    SidebarComponent,
    PendingEventsComponent,
    BlockchainLogComponent,
    ReportsComponent,
    CreateFarmComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
