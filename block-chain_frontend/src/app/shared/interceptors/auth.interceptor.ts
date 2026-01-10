import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    try {
      const token = sessionStorage.getItem('authToken');
      // Debug: indicate whether we found a token and the request url (do not log the full token)
      if (token) {
        try { console.debug('[AuthInterceptor] attaching token to', req.url, 'tokenLen=', token.length); } catch (e) { /* ignore */ }
        const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
        return next.handle(cloned);
      } else {
        try { console.debug('[AuthInterceptor] no token found for', req.url); } catch (e) { /* ignore */ }
      }
    } catch (e) {
      // sessionStorage might throw in some environments; silently continue without token
      console.warn('AuthInterceptor: could not read sessionStorage', e);
    }
    return next.handle(req);
  }
}
