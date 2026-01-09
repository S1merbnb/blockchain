import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface PendingEvent {
  id: string;
  farm: string;
  region: string;
  dateDetected: string; // ISO date
  confidence: number; // 0-100
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  blockchainTx?: string | null;
}

@Component({
  selector: 'app-pending-events',
  templateUrl: './pending-events.component.html',
  styleUrls: ['./pending-events.component.scss']
})
export class PendingEventsComponent implements OnInit {
  // search term for quick text filtering
  searchTerm: string = '';

  // mock dataset (replace with API call later)
  events: PendingEvent[] = [
    { id: 'EVT-1001', farm: 'Green Valley Farm', region: 'North', dateDetected: '2026-01-04T10:12:00Z', confidence: 88, status: 'Pending' },
    { id: 'EVT-1002', farm: 'Sunny Orchard', region: 'South', dateDetected: '2026-01-05T08:20:00Z', confidence: 45, status: 'Pending' },
    { id: 'EVT-1003', farm: 'Riverbend Estate', region: 'East', dateDetected: '2025-12-28T14:30:00Z', confidence: 32, status: 'Pending' },
    { id: 'EVT-1004', farm: 'Hilltop Agro', region: 'West', dateDetected: '2025-12-30T16:00:00Z', confidence: 74, status: 'Pending' },
    { id: 'EVT-1005', farm: 'Olive Grove', region: 'North', dateDetected: '2026-01-02T09:05:00Z', confidence: 95, status: 'Pending' },
    { id: 'EVT-1006', farm: 'Meadow Lands', region: 'South', dateDetected: '2025-12-15T11:11:00Z', confidence: 55, status: 'Pending' }
  ];

  // UI state
  sortField: 'confidence' | 'dateDetected' = 'confidence';
  sortDir: 'asc' | 'desc' = 'desc';

  filterRegion = 'All';
  filterStartDate: string | null = null; // yyyy-MM-dd
  filterEndDate: string | null = null;

  regions: string[] = [];
  // modal / detail state
  showModal = false;
  selectedEvent: PendingEvent | null = null;
  processingAction = false;
  // weather data shown in modal
  modalRain: number[] = [];
  modalTemp: number[] = [];
  modalAnomalies: string[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.regions = Array.from(new Set(this.events.map(e => e.region))).sort();
  }

  // returns events after applying filters and sort
  get filteredEvents(): PendingEvent[] {
    let out = this.events.slice();

    // text search (id, farm, region)
    if (this.searchTerm && this.searchTerm.trim()) {
      const q = this.searchTerm.trim().toLowerCase();
      out = out.filter(e => e.id.toLowerCase().includes(q) || e.farm.toLowerCase().includes(q) || e.region.toLowerCase().includes(q));
    }

    // region filter
    if (this.filterRegion && this.filterRegion !== 'All') {
      out = out.filter(e => e.region === this.filterRegion);
    }

    // date filters (compare by date only)
    if (this.filterStartDate) {
      const start = new Date(this.filterStartDate);
      out = out.filter(e => new Date(e.dateDetected) >= start);
    }
    if (this.filterEndDate) {
      // include full day
      const end = new Date(this.filterEndDate);
      end.setHours(23, 59, 59, 999);
      out = out.filter(e => new Date(e.dateDetected) <= end);
    }

    // sort
    out.sort((a, b) => {
      let va: any = a[this.sortField];
      let vb: any = b[this.sortField];
      // if sorting by date, convert to timestamp
      if (this.sortField === 'dateDetected') {
        va = new Date(va).getTime();
        vb = new Date(vb).getTime();
      }
      if (va < vb) return this.sortDir === 'asc' ? -1 : 1;
      if (va > vb) return this.sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return out;
  }

  // small helpers for UI KPIs
  getAvgConfidence(): number {
    const arr = this.filteredEvents;
    if (!arr.length) return 0;
    const sum = arr.reduce((s, e) => s + e.confidence, 0);
    return Math.round(sum / arr.length);
  }

  highRiskCount(): number {
    return this.filteredEvents.filter(e => e.confidence >= 75).length;
  }

  toggleSort(field: 'confidence' | 'dateDetected') {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = 'desc';
    }
  }

  // derive risk label/color from confidence
  riskLabel(confidence: number) {
    if (confidence >= 75) return { label: 'High', color: 'var(--danger)' };
    if (confidence >= 40) return { label: 'Medium', color: 'var(--warning)' };
    return { label: 'Low', color: 'var(--muted)' };
  }

  viewEvent(evt: PendingEvent) {
    this.openModal(evt);
  }

  openModal(evt: PendingEvent) {
    this.selectedEvent = evt;
    this.showModal = true;
    this.processingAction = false;
    // generate deterministic mock weather series
    const seed = this.hashSeed(evt.id);
    this.modalRain = this.generateSeries(seed, 14, 0, 60, 8);
    this.modalTemp = this.generateSeries(seed + 13, 14, -8, 18, 6);
    this.modalAnomalies = this.detectAnomalies(this.modalRain, this.modalTemp);
  }

  closeModal() {
    this.showModal = false;
    this.selectedEvent = null;
    this.modalRain = [];
    this.modalTemp = [];
    this.modalAnomalies = [];
  }

  confirmRefund() {
    if (!this.selectedEvent || this.processingAction) return;
    this.processingAction = true;
    setTimeout(() => {
      const tx = this.mockTxHash();
      this.selectedEvent!.status = 'Confirmed';
      this.selectedEvent!.blockchainTx = tx;
      this.processingAction = false;
    }, 1100);
  }

  cancelRefund() {
    if (!this.selectedEvent || this.processingAction) return;
    this.processingAction = true;
    setTimeout(() => {
      const tx = this.mockTxHash();
      this.selectedEvent!.status = 'Cancelled';
      this.selectedEvent!.blockchainTx = tx;
      this.processingAction = false;
    }, 900);
  }

  private hashSeed(s: string) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 1000;
    return h;
  }

  private generateSeries(seed: number, len: number, min: number, max: number, jitter = 4): number[] {
    const out: number[] = [];
    let v = (seed % (max - min)) + min;
    for (let i = 0; i < len; i++) {
      const delta = Math.round(((seed * (i + 1)) % (jitter * 2)) - jitter);
      v = Math.max(min, Math.min(max, v + delta));
      out.push(Math.round(v));
    }
    return out;
  }

  private detectAnomalies(rain: number[], temp: number[]) {
    const a: string[] = [];
    temp.forEach((t, i) => { if (t <= -2) a.push(`Frost on day ${i + 1}`); });
    rain.forEach((r, i) => { if (r >= 25) a.push(`Storm (heavy rain) day ${i + 1}`); });
    return a;
  }

  private mockTxHash(): string {
    return '0x' + Array.from({ length: 32 }).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  // generate a polyline points string for svg sparkline
  sparkline(data: number[], width = 300, height = 60) {
    if (!data || !data.length) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max === min ? 1 : max - min;
    return data.map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
  }
}
