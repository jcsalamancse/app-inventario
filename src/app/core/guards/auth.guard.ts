import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { selectIsAuthenticated } from '../../store/selectors/auth.selectors';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

export const authGuard = () => {
  const router = inject(Router);
  const store = inject(Store);
  const platformId = inject(PLATFORM_ID);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map(isAuthenticated => {
      // Solo revisa localStorage si estamos en el navegador
      if (isPlatformBrowser(platformId)) {
        const token = localStorage.getItem('auth_token');
        if (!isAuthenticated && !token) {
          router.navigate(['/login']);
          return false;
        }
      } else {
        // Durante SSR/prerender, solo confía en el estado de NgRx
        if (!isAuthenticated) {
          router.navigate(['/login']);
          return false;
        }
      }
      return true;
    })
  );
}; 