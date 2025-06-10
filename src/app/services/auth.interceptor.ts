import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // No agregar Authorization en login
  if (req.url.includes('/Auth/Login')) {
    return next(req);
  }
  const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
}; 