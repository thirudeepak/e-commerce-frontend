import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Normalize duplicate slashes in the path while preserving protocol (http:// or https://)
  const normalizedUrl = req.url.replace(/([^:]\/)\/+/g, '$1');

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cloned = req.clone({
    url: normalizedUrl,
    setHeaders: headers
  });

  return next(cloned);
};

