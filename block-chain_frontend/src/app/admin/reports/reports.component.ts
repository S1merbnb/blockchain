import { Component, OnInit } from '@angular/core';

interface EventRecord {
  id: string;
  region: string;
  dateDetected: string; // ISO
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  weather: 'Rain' | 'Frost' | 'Storm' | 'Clear' | 'Wind';
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  // filters
  filterRegion = 'All';
  startDate: string | null = null;
  endDate: string | null = null;

  regions: string[] = [];

  // mock dataset
  events: EventRecord[] = [];

  constructor() {}

  ngOnInit(): void {
    // generate mock data
    const regions = ['North','South','East','West'];
    const weathers: EventRecord['weather'][] = ['Rain','Frost','Storm','Clear','Wind'];
    const statuses: EventRecord['status'][] = ['Pending','Confirmed','Cancelled'];
    const now = new Date();
    for (let i = 0; i < 120; i++) {
      const daysAgo = Math.floor(Math.random() * 40);
      const d = new Date(now.getTime() - daysAgo * 24 * 3600 * 1000 - Math.floor(Math.random()*86400000));
      const evt: EventRecord = {
        id: `EVT-${1000 + i}`,
        region: regions[Math.floor(Math.random() * regions.length)],
        dateDetected: d.toISOString(),
        status: Math.random() > 0.6 ? 'Pending' : (Math.random() > 0.5 ? 'Confirmed' : 'Cancelled'),
        weather: weathers[Math.floor(Math.random() * weathers.length)]
      };
      this.events.push(evt);
    }
    this.regions = Array.from(new Set(this.events.map(e => e.region))).sort();
  }

  // filtered list based on UI controls
  get filtered(): EventRecord[] {
    let out = this.events.slice();
    if (this.filterRegion !== 'All') out = out.filter(e => e.region === this.filterRegion);
    if (this.startDate) {
      const s = new Date(this.startDate);
      out = out.filter(e => new Date(e.dateDetected) >= s);
    }
    if (this.endDate) {
      const eDate = new Date(this.endDate);
      eDate.setHours(23,59,59,999);
      out = out.filter(e => new Date(e.dateDetected) <= eDate);
    }
    return out.sort((a,b) => new Date(b.dateDetected).getTime() - new Date(a.dateDetected).getTime());
  }

  // chart data helpers
  confirmedVsCancelled() {
    const list = this.filtered;
    const confirmed = list.filter(x => x.status === 'Confirmed').length;
    const cancelled = list.filter(x => x.status === 'Cancelled').length;
    const pending = list.filter(x => x.status === 'Pending').length;
    return { confirmed, cancelled, pending };
  }

  eventsByWeather() {
    const map = new Map<string, number>();
    for (const e of this.filtered) map.set(e.weather, (map.get(e.weather) || 0) + 1);
    return Array.from(map.entries()).sort((a,b) => b[1]-a[1]);
  }

  // simple SVG bar generator
  barPoints(values: number[], width = 300, height = 120) {
    const max = Math.max(1, ...values);
    return values.map((v,i) => ({ x: (i / (values.length)) * width + 10, w: (width / values.length) - 10, h: Math.round((v / max) * height), v })).reverse();
  }

  exportCSV() {
    const rows = this.filtered.map(r => ({ id: r.id, region: r.region, dateDetected: r.dateDetected, status: r.status, weather: r.weather }));
    const header = Object.keys(rows[0] || {}).join(',') + '\n';
    const lines = rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const csv = header + lines;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reports_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
