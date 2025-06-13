import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Movement, MovementFormData } from '../models/movement.model';

@Injectable({ providedIn: 'root' })
export class MovementService {
  private apiUrl = environment.apiUrl + '/movement';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Movement[]> {
    return this.http.get<Movement[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Movement> {
    return this.http.get<Movement>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  create(movement: MovementFormData): Observable<Movement> {
    return this.http.post<Movement>(this.apiUrl, movement).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, movement: MovementFormData): Observable<Movement> {
    return this.http.put<Movement>(`${this.apiUrl}/${id}`, movement).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getByProduct(productId: number): Observable<Movement[]> {
    return this.http.get<Movement[]>(`${this.apiUrl}/product/${productId}`).pipe(
      catchError(this.handleError)
    );
  }

  createMovement(payload: { movementDto: MovementFormData }) {
    return this.http.post(this.apiUrl, payload);
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }
} 