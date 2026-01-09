import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // KPIs
  totalFarms = 2500;
  pendingEvents = 12;
  confirmedRefunds = 48;
  cancelledEvents = 6;

  // Small chart data (events per week for last 8 weeks)
  eventsPerWeek: number[] = [4, 6, 5, 8, 7, 9, 6, 10];
  sparkPoints = '';
  maxValue = 0;
  avgValue = 0;

  // Status
  systemOnline = true;
  lastWeatherUpdate: Date = new Date();
  // show the overview content when the current route is exactly /dashboard
  showOverview = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.sparkPoints = this.toPolylinePoints(this.eventsPerWeek, 140, 40);
    this.maxValue = this.computeMax(this.eventsPerWeek);
    this.avgValue = this.computeAvg(this.eventsPerWeek);

    // set initial visibility and listen for route changes so child routes render
    this.setShowOverview(this.router.url);
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.setShowOverview(e.urlAfterRedirects);
    });
  }

  // Convert numeric series to SVG polyline points in a small canvas
  private toPolylinePoints(values: number[], width: number, height: number): string {
    if (!values || values.length === 0) return '';
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const step = width / (values.length - 1);
    return values
      .map((v, i) => {
        const x = (i * step).toFixed(2);
        // invert y because SVG origin is top-left
        const y = (height - ((v - min) / range) * height).toFixed(2);
        return `${x},${y}`;
      })
      .join(' ');
  }

  private computeMax(values: number[]): number {
    return values && values.length ? Math.max(...values) : 0;
  }

  private computeAvg(values: number[]): number {
    if (!values || values.length === 0) return 0;
    const sum = values.reduce((s, v) => s + v, 0);
    return Math.round((sum / values.length) * 10) / 10; // one decimal
  }

  private setShowOverview(url: string) {
    this.showOverview = url === '/dashboard' || url === '/dashboard/';
  }
}
