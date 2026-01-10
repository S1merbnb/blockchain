import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public submitting = false;
  public success = false;
  public message = '';

  // small modal open state
  public open = false;

  // users list for the table under the button
  public users: User[] = [];
  public loadingUsers = false;
  // search term for filtering users by email
  public searchTerm = '';

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loadingUsers = true;
    this.userService.listUsers().subscribe({
      next: (list) => { this.users = list || []; this.loadingUsers = false; },
      error: () => { this.users = []; this.loadingUsers = false; }
    });
  }

  // computed list filtered by `searchTerm` (case-insensitive)
  get filteredUsers(): User[] {
    const term = (this.searchTerm || '').trim().toLowerCase();
    if (!term) return this.users;
    return this.users.filter(u => (u.email || '').toLowerCase().includes(term));
  }

  // Change a user's role. This accepts the target role and updates optimistically,
  // disabling the role buttons while the request is in flight.
  saveRole(user: User, role: string) {
    if (!user || !user.email || !role) return;
    const prevRole = user.role;
    // optimistic UI: show the selected role immediately
    user.role = role;
    (user as any).saving = true;
    // clear previous per-row error
    delete (user as any).error;

    this.userService.updateRole(user.email, String(role)).subscribe({
      next: (updated) => {
        (user as any).saving = false;
        if ((updated as any).role) user.role = (updated as any).role;
      },
      error: (err) => {
        // revert on error and surface per-row message
        (user as any).saving = false;
        user.role = prevRole;
        const status = err?.status;
        if (status === 403) {
          (user as any).error = 'Permission denied: you are not allowed to change roles.';
        } else {
          const msg = err?.error || err?.message || `${err?.status || 'Error'} ${err?.statusText || ''}`;
          (user as any).error = 'Failed to update role: ' + msg;
        }
        console.error('Failed to update role for', user.email, err);
      }
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.submitting) return;
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = (formData.get('email') || '').toString().trim();
    const password = (formData.get('password') || '').toString();
    const roleVal = (formData.get('role') || '').toString().trim();
    const role = roleVal ? roleVal : 'ADMIN';

    if (!email || !password) {
      this.message = 'Please provide email and password';
      return;
    }

    this.submitting = true;
    this.message = '';

    this.userService.register(email, password, role).subscribe({
      next: () => {
        this.success = true;
        this.message = 'Registration successful. You are now registered.';
        this.submitting = false;
        form.reset();
        this.open = false; // close modal
        this.loadUsers(); // refresh table
      },
      error: (err) => {
        const message = err?.error || err?.message || err?.statusText || 'Unknown error';
        this.message = 'Registration failed: ' + message;
        this.submitting = false;
      }
    });
  }

 

}

