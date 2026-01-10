import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse, User } from '../models/user.model';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	// Adjust baseUrl if your backend runs on a different port/host
	private baseUrl = 'http://localhost:8081/api/auth';

	constructor(private http: HttpClient) { }

	login(email: string, password: string): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { email, password });
	}

	// register is provided for admin usage via backend API; not used by public UI
	register(email: string, password: string, role?: string): Observable<any> {
		return this.http.post(`${this.baseUrl}/register`, { email, password, role });
	}

	listUsers(): Observable<User[]> {
		return this.http.get<User[]>(`${this.baseUrl}/users`);
	}

	updateRole(email: string, role: string): Observable<User> {
		return this.http.put<User>(`${this.baseUrl}/users/role`, { email, role });
	}
}
