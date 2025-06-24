import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Warehouse } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class WarehouseService {
  private apiUrl = `${environment.apiUrl}/Warehouse`;

  constructor(private http: HttpClient) {}

  getWarehouses(): Observable<Warehouse[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => (response?.$values ?? response).map((w: any) => ({
        id: w.Id,
        name: w.Name
      })))
    );
  }
} 