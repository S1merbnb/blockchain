import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherWidgetComponent } from './public/weather-widget/weather-widget.component';
import { HowItWorksComponent } from './public/how-it-works/how-it-works.component';
import { HomeComponent } from './public/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: 'weather-widget', component: WeatherWidgetComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
 }
