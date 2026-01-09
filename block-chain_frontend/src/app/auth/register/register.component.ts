import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  public submitting = false;
  public success = false;
  public message = '';

  constructor(private router: Router, private userService: UserService) { }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.submitting) return;

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = (formData.get('email') || '').toString().trim();
    const password = (formData.get('password') || '').toString();
    const roleVal = (formData.get('role') || '').toString().trim();
    const role = roleVal ? roleVal : 'USER';

    if (!email || !password) {
      this.message = 'Please provide email and password';
      return;
    }

    this.submitting = true;
    this.message = '';

    this.userService.register(email, password, role).subscribe({
      next: (res) => {
        console.log('Register response', res);
        this.success = true;
        this.message = 'Registration successful. You are now registered.';
        this.submitting = false;
        // do not redirect automatically - user can choose to go to login
        form.reset();
      },
      error: (err) => {
        console.error('Register failed', err);
        const message = err?.error || err?.message || err?.statusText || 'Unknown error';
        this.message = 'Registration failed: ' + message;
        this.submitting = false;
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}

