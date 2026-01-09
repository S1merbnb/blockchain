import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private router: Router) {}

  onSubmit(event: Event) {
    event.preventDefault();
    // Extract form values
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = (formData.get('email') || '').toString();

    // Create a simple session token (placeholder)
    const payload = {
      email,
      iat: Date.now(),
      nonce: Math.random().toString(36).slice(2)
    };
    const token = btoa(JSON.stringify(payload));

    // Store token in sessionStorage
    try {
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('authUser', email);
      // Optional: set expiry (1 hour)
      sessionStorage.setItem('authExpiry', (Date.now() + 60 * 60 * 1000).toString());
    } catch (e) {
      console.warn('Could not persist session token', e);
    }

    // Navigate to dashboard
    this.router.navigate(['/dashboard']);
  }

}
