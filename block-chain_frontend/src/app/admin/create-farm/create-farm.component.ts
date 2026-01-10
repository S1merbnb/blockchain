import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { FarmService } from '../../shared/services/farm.service';
import { FrontFarm } from '../../shared/models/farm.model';

declare const L: any; // Leaflet global (loaded dynamically)

// Reuse FrontFarm from shared models (alias locally)
type Farm = FrontFarm;

@Component({
  selector: 'app-create-farm',
  templateUrl: './create-farm.component.html',
  styleUrls: ['./create-farm.component.scss']
})
export class CreateFarmComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('modalMap', { static: false }) modalMapRef!: ElementRef;
  @ViewChild('mainMap', { static: false }) mainMapRef!: ElementRef;

  showModal = false;
  drawing = false;
  drawingPoints: Array<[number, number]> = [];

  farms: Farm[] = [];
  nextId = 1;

  // UI state
  searchTerm = '';
  sortField: keyof Farm | '' = '';
  sortAsc = true;
  editingFarm: Farm | null = null;

  // Leaflet maps and layers
  private modalMap: any = null;
  private mainMap: any = null;
  private drawnLayer: any = null;
  private farmLayers: Map<number, any> = new Map();

  constructor(private hostRef: ElementRef, private farmService: FarmService) {}

  ngAfterViewInit(): void {
    this.ensureLeaflet(() => {
      this.initMainMap();
    });
  }

  ngOnInit(): void {
    // load farms from backend when component initializes
    this.loadFarms();
  }

  ngOnDestroy(): void {
    try {
      if (this.modalMap) this.modalMap.remove();
      if (this.mainMap) this.mainMap.remove();
    } catch (e) { /* ignore */ }
  }

  // Load Leaflet CSS+JS from CDN if not present, then call cb
  private ensureLeaflet(cb: () => void) {
    const cssId = 'leaflet-css';
    const jsId = 'leaflet-js';
    if (!(window as any).L) {
      if (!document.getElementById(cssId)) {
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.crossOrigin = '';
        document.head.appendChild(link);
      }
      if (!document.getElementById(jsId)) {
        const script = document.createElement('script');
        script.id = jsId;
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => cb();
        document.body.appendChild(script);
      } else {
        // script present but L may not be ready yet
        const check = setInterval(() => {
          if ((window as any).L) {
            clearInterval(check);
            cb();
          }
        }, 50);
      }
    } else {
      cb();
    }
  }

  openModal(edit?: Farm) {
    this.editingFarm = edit ? { ...edit } : null;
    this.showModal = true;
    // initialize modal map after a short delay so container exists
    setTimeout(() => this.initModalMap(), 200);
  }

  closeModal() {
    this.showModal = false;
    this.drawing = false;
    this.drawingPoints = [];
    try {
      if (this.drawnLayer && this.modalMap) {
        this.modalMap.removeLayer(this.drawnLayer);
        this.drawnLayer = null;
      }
    } catch (e) { /* ignore */ }

    // Properly destroy modal map to avoid Leaflet crashes when the container is removed/hidden.
    try {
      if (this.modalMap) {
        this.modalMap.off();
        this.modalMap.remove();
        this.modalMap = null;
      }
    } catch (e) { /* ignore */ }
  }

  private initModalMap() {
    if (!this.modalMapRef) return;
    // If a modalMap already exists, try to resize it and return. If it's been removed, recreate below.
    if (this.modalMap) {
      try { this.modalMap.invalidateSize(); } catch (e) { /* ignore */ }
      return;
    }
    const el = this.modalMapRef.nativeElement;
    this.modalMap = L.map(el).setView([36.8, 10.1], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.modalMap);

    // if editing, draw existing polygon
    if (this.editingFarm && this.editingFarm.polygon) {
      this.drawingPoints = this.editingFarm.polygon.map(p => [p[0], p[1]]);
      this.drawPreview();
      this.modalMap.fitBounds(this.drawnLayer.getBounds());
    }

    this.modalMap.on('click', (e: any) => {
      if (!this.drawing) return;
      this.drawingPoints.push([e.latlng.lat, e.latlng.lng]);
      this.drawPreview();
    });
  }

  private initMainMap() {
    if (!this.mainMapRef) return;
    const el = this.mainMapRef.nativeElement;
    this.mainMap = L.map(el).setView([36.8, 10.1], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.mainMap);
    // ensure layers for any existing farms
    this.ensureFarmLayers();
  }

  startDrawing() {
    this.drawing = true;
    this.drawingPoints = [];
  }

  finishDrawing() {
    if (this.drawingPoints.length < 3) return alert('Draw at least 3 points to form a polygon');
    this.drawing = false;
    this.drawPreview(true);
  }

  clearDrawing() {
    this.drawingPoints = [];
    this.drawing = false;
    if (this.drawnLayer) {
      this.modalMap.removeLayer(this.drawnLayer);
      this.drawnLayer = null;
    }
  }

  private drawPreview(final = false) {
    if (!this.modalMap) return;
    if (this.drawnLayer) this.modalMap.removeLayer(this.drawnLayer);
    const latlngs = this.drawingPoints.map(p => [p[0], p[1]]);
    if (latlngs.length === 0) return;
    this.drawnLayer = L.polygon(latlngs, { color: final ? '#2b8cbe' : '#ff7800', weight: 2, opacity: 0.7 }).addTo(this.modalMap);
  }

  onSave(formEl: HTMLFormElement) {
    // manual form read (no ngModel required)
    const fd = new FormData(formEl);
    const farmName = (fd.get('farmName') || '').toString().trim();
    const farmerName = (fd.get('farmerName') || '').toString().trim();
    const phone = (fd.get('phone') || '').toString().trim();
    const area = parseFloat((fd.get('area') || '0').toString()) || 0;
    const cropType = (fd.get('cropType') || 'Olive').toString();
    const notes = (fd.get('notes') || '').toString();

    if (!farmName) return alert('Farm Name is required');

    const polygon = this.drawingPoints.length ? this.drawingPoints.map(p => [p[0], p[1]]) : undefined;

    if (this.editingFarm) {
      // persist update to backend
      const updated: Farm = { ...this.editingFarm!, farmName, farmerName, phone, area, cropType, notes, polygon };
      this.farmService.updateFarm(updated).subscribe({
        next: (saved) => {
          const idx = this.farms.findIndex(f => f.id === saved.id);
          if (idx >= 0) {
            this.farms[idx] = saved as Farm;
            this.updateFarmLayer(this.farms[idx]);
          }
        },
        error: (err) => {
          console.error('Failed to update farm', err);
          alert('Failed to update farm: ' + (err?.message || err?.statusText || 'Unknown'));
        },
        complete: () => this.closeModal()
      });
    } else {
      // persist to backend
      const newFarm: Farm = { farmName, farmerName, phone, area, cropType, notes, polygon };
      this.farmService.addFarm(newFarm).subscribe({
        next: (saved) => {
          // backend returns id and createdAt; add to local list and layer
          this.farms.push(saved as Farm);
          this.addFarmLayer(saved as Farm);
        },
        error: (err) => {
          console.error('Failed to save farm', err);
          alert('Failed to save farm: ' + (err?.message || err?.statusText || 'Unknown'));
        },
        complete: () => this.closeModal()
      });
    }

    if (!this.editingFarm) {
      // when creating, closeModal will be called in complete; otherwise close now
    } else {
      this.closeModal();
    }
  }

  private loadFarms() {
    this.farmService.getAll().subscribe({
      next: (list) => {
        this.farms = list || [];
        // ensure map layers exist if mainMap already initialized
        setTimeout(() => this.ensureFarmLayers(), 50);
      },
      error: (err) => {
        console.error('Failed to load farms', err);
      }
    });
  }

  // Table helpers
  filteredFarms(): Farm[] {
    const q = this.searchTerm.trim().toLowerCase();
    let list = this.farms.filter(f => {
      if (!q) return true;
      return (f.farmName || '').toLowerCase().includes(q)
        || (f.farmerName || '').toLowerCase().includes(q)
        || (f.phone || '').toLowerCase().includes(q);
    });
    if (this.sortField) {
      list = list.sort((a: any, b: any) => {
        const av = a[this.sortField as string];
        const bv = b[this.sortField as string];
        if (av == null) return 1;
        if (bv == null) return -1;
        if (av === bv) return 0;
        return (av > bv ? 1 : -1) * (this.sortAsc ? 1 : -1);
      });
    }
    return list;
  }

  setSort(field: keyof Farm) {
    if (this.sortField === field) this.sortAsc = !this.sortAsc;
    else { this.sortField = field; this.sortAsc = true; }
  }

  edit(farm: Farm) {
    this.openModal(farm);
    // pre-fill drawing with farm polygon
    setTimeout(() => {
      if (!this.modalMap) return;
      this.drawingPoints = farm.polygon ? farm.polygon.map(p => [p[0], p[1]]) : [];
      this.drawPreview();
      if (this.drawingPoints.length && this.drawnLayer) this.modalMap.fitBounds(this.drawnLayer.getBounds());
    }, 300);
  }

  delete(farm: Farm) {
    if (!confirm(`Delete farm "${farm.farmName}"? This cannot be undone.`)) return;
    if (farm.id == null) return;
    const id = farm.id;
    // call backend delete
    this.farmService.deleteFarm(id).subscribe({
      next: () => {
        this.farms = this.farms.filter(f => f.id !== id);
        const layer = this.farmLayers.get(id);
        if (layer && this.mainMap) this.mainMap.removeLayer(layer);
        this.farmLayers.delete(id);
      },
      error: (err) => {
        console.error('Failed to delete farm', err);
        alert('Failed to delete farm: ' + (err?.message || err?.statusText || 'Unknown'));
      }
    });
  }

  viewOnMap(farm: Farm) {
    if (!farm.polygon || !this.mainMap) return alert('No polygon available for this farm');
    if (farm.id == null) return;
    const layer = this.farmLayers.get(farm.id);
    if (layer) {
      this.mainMap.fitBounds(layer.getBounds(), { padding: [20, 20] });
    }
  }

  // Map layer management
  private addFarmLayer(farm: Farm) {
    if (!this.mainMap || !farm.polygon) return;
    const layer = L.polygon(farm.polygon, { color: '#2b8cbe', weight: 2 }).addTo(this.mainMap);
    layer.on('click', () => {
      const stats = this.fakeStats();
      layer.bindPopup(`<strong>${farm.farmName}</strong><br/>Farmer: ${farm.farmerName}<br/>Area: ${farm.area} ha<br/>NDVI: ${stats.ndvi}<br/>NDWI: ${stats.ndwi}`).openPopup();
    });
    if (farm.id == null) return;
    this.farmLayers.set(farm.id, layer);
  }

  private updateFarmLayer(farm: Farm) {
    if (farm.id == null) return;
    const existing = this.farmLayers.get(farm.id);
    if (existing && this.mainMap) this.mainMap.removeLayer(existing);
    if (farm.polygon) this.addFarmLayer(farm);
  }

  // Called after modal closes / when adding farms to ensure layers present
  private ensureFarmLayers() {
    this.farms.forEach(f => {
      if (f.id == null) return;
      if (f.polygon && !this.farmLayers.has(f.id) && this.mainMap) this.addFarmLayer(f);
    });
  }

  // Hover highlight
  highlight(farm: Farm, on: boolean) {
    if (farm.id == null) return;
    const layer = this.farmLayers.get(farm.id);
    if (!layer) return;
    layer.setStyle({ weight: on ? 4 : 2, color: on ? '#ff0000' : '#2b8cbe' });
  }

  // small fake NDVI/NDWI generator
  private fakeStats() {
    const ndvi = (Math.random() * 0.6 + 0.2).toFixed(2);
    const ndwi = (Math.random() * 0.6 + 0.1).toFixed(2);
    return { ndvi, ndwi };
  }

  // UI hooks
  onSearch(e: Event) {
    const v = (e.target as HTMLInputElement).value || '';
    this.searchTerm = v;
  }

  // Keep map layers in sync when farms list changes
  trackById(i: number, f: Farm) { return f.id ?? i; }
}
