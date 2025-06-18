import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        router.navigate(['/login']);
      } else if (error.status === 404) {
        router.navigate(['/not-found']);
      } else if (error.name === 'TimeoutError') {
        // Manejar errores de timeout específicamente
        console.error('Timeout en la petición:', req.url);
        // Aquí podrías mostrar un mensaje al usuario o redirigir a una página de error
      }
      return throwError(() => error);
    })
  );
}; 