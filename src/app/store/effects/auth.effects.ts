import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as AuthActions from '../actions/auth.actions';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(action =>
        this.authService.login(action.username, action.password).pipe(
          map(response => {
            // Guardar token en localStorage
            localStorage.setItem('token', response.token);
            if (response.refreshToken) {
              localStorage.setItem('refreshToken', response.refreshToken);
            }
            return AuthActions.loginSuccess({ user: response.user });
          }),
          catchError(error => {
            let errorMsg = 'Error de autenticación';
            if (error.error && error.error.message) {
              errorMsg = error.error.message;
            }
            // Mostrar pop-up de error
            this.snackBar.open(errorMsg, 'Aceptar', { duration: 4000, panelClass: 'bg-red-600 text-white' });
            return of(AuthActions.loginFailure({ error: errorMsg }));
          })
        )
      )
    );
  });

  loginSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => {
        this.snackBar.open('¡Autenticación exitosa!', 'Aceptar', { duration: 2000, panelClass: 'bg-green-600 text-white' });
        this.router.navigate(['/dashboard']);
      }),
      map(() => ({ type: '[Auth] Login Success Navigation' }))
    );
  });

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/login']);
      }),
      map(() => AuthActions.logoutSuccess())
    );
  });
} 