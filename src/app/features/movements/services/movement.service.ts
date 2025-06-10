import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Movement, MovementFormData } from '../models/movement.model';

const API_BASE = environment.apiUrl; // Debe terminar en /api
const ENDPOINTS = {
  BASE: `${API_BASE}/Movement`,
  BY_ID: (id: number) => `${API_BASE}/Movement/${id}`,
  BY_PRODUCT: (productId: number) => `${API_BASE}/Movement/product/${productId}`
};

@Injectable({ providedIn: 'root' })
export class MovementService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Movement[]> {
    return this.http.get<any>(ENDPOINTS.BASE).pipe(
      map(data => Array.isArray(data) ? data : (data?.Movements?.$values || [])),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Movement> {
    return this.http.get<Movement>(ENDPOINTS.BY_ID(id)).pipe(
      catchError(this.handleError)
    );
  }

  create(movement: MovementFormData): Observable<Movement> {
    return this.http.post<Movement>(ENDPOINTS.BASE, movement).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, movement: MovementFormData): Observable<Movement> {
    return this.http.put<Movement>(ENDPOINTS.BY_ID(id), movement).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(ENDPOINTS.BY_ID(id)).pipe(
      catchError(this.handleError)
    );
  }

  getByProduct(productId: number): Observable<Movement[]> {
    return this.http.get<any>(ENDPOINTS.BY_PRODUCT(productId)).pipe(
      map(data => Array.isArray(data) ? data : (data?.Movements?.$values || [])),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    // Manejo de errores centralizado
    return throwError(() => error);
  }
} 