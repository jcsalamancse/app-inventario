import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

export interface AuthResponse {
  Token: string;
  RefreshToken?: string;
  ExpiresIn?: number;
  user: any;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
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
  private readonly baseUrl = 'https://localhost:7044/Api'; // Cambia esto según tu entorno
  private readonly loginEndpoint = '/Auth/Login';
  private readonly changePasswordEndpoint = '/user/me/password';
  private readonly usersEndpoint = '/User';
  private readonly rolesEndpoint = '/roles';

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

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): any {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  changePassword(request: ChangePasswordRequest): Observable<any> {
    return this.http.put(
      this.baseUrl + this.changePasswordEndpoint,
      request
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
} 