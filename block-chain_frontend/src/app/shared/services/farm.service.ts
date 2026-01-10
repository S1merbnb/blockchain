import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BackendFarm, FrontFarm } from '../models/farm.model';

@Injectable({ providedIn: 'root' })
export class FarmService {
  private base = 'http://localhost:8081/api/farms';

  constructor(private http: HttpClient) {}

  getAll(): Observable<FrontFarm[]> {
    return this.http.get<BackendFarm[]>(this.base).pipe(
      map(list => list.map(b => this.toFront(b)))
    );
  }

  addFarm(f: FrontFarm): Observable<FrontFarm> {
    const payload: BackendFarm = {
      name: f.farmName,
      farmerName: f.farmerName,
      farmerPhone: f.phone,
      cropType: f.cropType,
      area: f.area,
      notes: f.notes,
      polygon: f.polygon ? JSON.stringify(f.polygon) : undefined
    };
    return this.http.post<BackendFarm>(this.base, payload).pipe(
      map(b => this.toFront(b))
    );
  }

  updateFarm(f: FrontFarm): Observable<FrontFarm> {
    if (!f.id) throw new Error('Farm id required for update');
    const payload: BackendFarm = {
      name: f.farmName,
      farmerName: f.farmerName,
      farmerPhone: f.phone,
      cropType: f.cropType,
      area: f.area,
      notes: f.notes,
      polygon: f.polygon ? JSON.stringify(f.polygon) : undefined
    };
    return this.http.put<BackendFarm>(`${this.base}/${f.id}`, payload).pipe(map(b => this.toFront(b)));
  }

  deleteFarm(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  search(keyword: string): Observable<FrontFarm[]> {
    return this.http.get<BackendFarm[]>(`${this.base}/search?keyword=${encodeURIComponent(keyword)}`).pipe(
      map(list => list.map(b => this.toFront(b)))
    );
  }

  private toFront(b: BackendFarm): FrontFarm {
    let polygon: number[][] | undefined = undefined;
    if (b.polygon) {
      try { polygon = JSON.parse(b.polygon); } catch (e) { polygon = undefined; }
    }
    return {
      id: b.id,
      farmName: b.name,
      farmerName: b.farmerName,
      phone: b.farmerPhone,
      cropType: b.cropType,
      area: b.area,
      notes: b.notes,
      polygon,
      createdAt: b.createdAt
    };
  }
}
