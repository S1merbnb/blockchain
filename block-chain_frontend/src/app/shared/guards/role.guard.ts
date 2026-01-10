import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  private checkAllowed(route: ActivatedRouteSnapshot): boolean {
    try {
      const role = sessionStorage.getItem('authRole');
      // read allowedRoles from route data (array of strings)
      const allowed: string[] | undefined = route.data && route.data['allowedRoles'];
      // if no allowedRoles provided, default to ['SUPERADMIN'] for safety
      const allowedList = Array.isArray(allowed) && allowed.length > 0 ? allowed : ['SUPERADMIN'];
      if (role && allowedList.includes(role)) return true;
    } catch (e) {
      // ignore and deny
    }
    return false;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const ok = this.checkAllowed(route);
    if (!ok) this.router.navigate(['/']);
    return ok;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const ok = this.checkAllowed(childRoute);
    if (!ok) this.router.navigate(['/']);
    return ok;
  }
}
