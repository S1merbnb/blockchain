import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  userEmail: string | null = null;
  userRole: string | null = null;

  constructor(private router: Router) {
    try {
      this.userEmail = sessionStorage.getItem('authUser');
      this.userRole = sessionStorage.getItem('authRole');
    } catch (e) {
      this.userEmail = null;
    }
  }

  logout() {
    try {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('authUser');
      sessionStorage.removeItem('authExpiry');
      sessionStorage.removeItem('authRole');
    } catch (e) {
      console.warn('Error clearing session', e);
    }
    this.router.navigate(['/']);
  }
}
