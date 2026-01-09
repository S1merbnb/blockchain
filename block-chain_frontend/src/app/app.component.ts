import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'block-chain_frontend';
  isAuthenticated = false;
  private sub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateAuthState();
    this.sub = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.updateAuthState();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private updateAuthState() {
    try {
      this.isAuthenticated = !!sessionStorage.getItem('authToken');
    } catch (e) {
      this.isAuthenticated = false;
    }
  }
}
