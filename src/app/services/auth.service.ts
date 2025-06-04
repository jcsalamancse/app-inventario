import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'https://localhost:7044'; // Cambia esto según tu entorno
  private readonly loginEndpoint = '/Auth/Login';

  constructor(private http: HttpClient) {}

  login(userName: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      this.baseUrl + this.loginEndpoint,
      { userName, password }
    );
  }
} 