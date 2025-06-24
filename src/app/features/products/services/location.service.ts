import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Location } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private apiUrl = `${environment.apiUrl}/Location`;

  constructor(private http: HttpClient) {}

  getLocations(): Observable<Location[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => (response?.$values ?? response).map((l: any) => ({
        id: l.Id,
        name: l.Name
      })))
    );
  }
} 