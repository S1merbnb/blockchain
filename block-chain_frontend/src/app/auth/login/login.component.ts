import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private router: Router, private userService: UserService) {}

  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = (formData.get('email') || '').toString();
    const password = (formData.get('password') || '').toString();

    if (!email || !password) {
      // basic client-side check
      alert('Please provide email and password');
      return;
    }

    this.userService.login(email, password).subscribe({
      next: (res) => {
        console.log('Login response', res);
        if (!res || !res.token) {
          console.warn('Login succeeded but no token returned', res);
          alert('Login failed: no token returned');
          return;
        }
        try {
          sessionStorage.setItem('authToken', res.token);
          sessionStorage.setItem('authUser', res.email);
          // expiry (1 hour)
          sessionStorage.setItem('authExpiry', (Date.now() + 60 * 60 * 1000).toString());
        } catch (e) {
          console.warn('Could not persist session token', e);
        }
        // navigate only after token is stored
        console.log('Navigating to /dashboard');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login failed', err);
        // If backend isn't reachable you may see CORS/404 errors here — open DevTools Network tab and inspect the POST to /api/auth/login
        const message = err?.error?.message || err?.error || err?.statusText || err?.message || 'Unknown error';
        alert('Login failed: ' + message);
      }
    });
  }

}
