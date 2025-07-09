import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { of, from } from 'rxjs';

export interface AuthResponse {
  Token: string;
  RefreshToken?: string;
  ExpiresIn?: number;
  user: any;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  Email: string;
  UserName: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface User {
  id: number;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
}

export interface Role {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private baseUrl = environment.apiUrl;
  private readonly loginEndpoint = '/Auth/Login';
  private readonly changePasswordEndpoint = 'User/me/password';
  private readonly usersEndpoint = '/User';
  private readonly rolesEndpoint = '/roles';
  private readonly refreshTokenEndpoint = '/api/auth/refresh-token';
  private readonly logoutEndpoint = '/api/auth/logout';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(userName: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      this.baseUrl + this.loginEndpoint,
      { userName, password }
    ).pipe(
      tap(response => {
        this.setToken(response.Token);
        this.setUser(response.user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.baseUrl + this.logoutEndpoint, {})
      .pipe(
        map(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user_data');
          localStorage.removeItem('token');
          localStorage.removeItem('rememberedUser');
          this.isAuthenticatedSubject.next(false);
          this.router.navigate(['/login']);
        }),
        catchError(this.handleError)
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): any {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr || userStr === 'undefined') {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getMe(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/User/me');
  }

  changePassword(request: ChangePasswordRequest): Observable<ChangePasswordResponse> {
    const body = {
      Email: request.Email,
      UserName: request.UserName,
      CurrentPassword: request.currentPassword,
      NewPassword: request.newPassword
    };
    return this.http.put<ChangePasswordResponse>(
      this.baseUrl + '/' + this.changePasswordEndpoint,
      body
    ).pipe(
      map(() => ({
        success: true,
        message: 'Contraseña cambiada exitosamente'
      })),
      catchError(this.handleError)
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + this.usersEndpoint);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.baseUrl + this.rolesEndpoint);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl + this.usersEndpoint, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}${this.usersEndpoint}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${this.usersEndpoint}/${id}`);
  }

  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.baseUrl + this.rolesEndpoint, role);
  }

  updateRole(id: number, role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.baseUrl}${this.rolesEndpoint}/${id}`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${this.rolesEndpoint}/${id}`);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private hasToken(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!this.getToken();
    }
    return false;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error al cambiar la contraseña';
    
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = error.error.message;
    } else {
      // Error del servidor
      errorMessage = error.error?.message || errorMessage;
    }
    
    return throwError(() => ({
      success: false,
      message: errorMessage
    }));
  }

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<{ token: string }>(this.baseUrl + this.refreshTokenEndpoint, { refreshToken })
      .pipe(
        map(response => {
          localStorage.setItem('token', response.token);
          return response.token;
        }),
        catchError(error => {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('tokenExpiration');
          this.isAuthenticatedSubject.next(false);
          return throwError(() => error);
        })
      );
  }

  /**
   * Solicita el envío de un correo de recuperación de contraseña
   * @param email Correo electrónico del usuario
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/forgot-password`, { email }).pipe(
      map(response => response),
      catchError((error: HttpErrorResponse) => {
        // Mensaje genérico por seguridad
        let errorMessage = 'No se pudo procesar la solicitud. Intenta nuevamente más tarde.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }

  /**
   * Restablece la contraseña usando el token recibido por email
   * @param token Token de restablecimiento
   * @param newPassword Nueva contraseña
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/user/reset-password`, { token, newPassword }).pipe(
      map(response => response),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'No se pudo restablecer la contraseña.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }
} 