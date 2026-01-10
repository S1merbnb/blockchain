export interface BackendFarm {
  id?: number;
  name: string;
  farmerName?: string;
  farmerPhone?: string;
  cropType?: string;
  area?: number;
  polygon?: string; // stored as JSON string on backend
  notes?: string;
  createdAt?: string;
}

// Frontend-friendly farm shape used in the UI
export interface FrontFarm {
  id?: number;
  farmName: string;
  farmerName?: string;
  phone?: string;
  cropType?: string;
  area?: number;
  polygon?: number[][]; // parsed polygon
  notes?: string;
  createdAt?: string;
}
