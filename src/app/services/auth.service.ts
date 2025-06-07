import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'https://localhost:7044/Api'; // Cambia esto según tu entorno
  private readonly loginEndpoint = '/Auth/Login';
  private readonly changePasswordEndpoint = '/user/me/password';

  constructor(private http: HttpClient) {}

  login(userName: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      this.baseUrl + this.loginEndpoint,
      { userName, password }
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<any> {
    return this.http.put(
      this.baseUrl + this.changePasswordEndpoint,
      request
    );
  }
} 