import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private apiUrl = `${environment.apiUrl}/Report`;

  constructor(private http: HttpClient) {}

  getReports(params?: any): Observable<any> {
    // Serializar los parámetros como query params
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get(`${this.apiUrl}`, { params: httpParams });
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  exportReport(params: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export`, params, { responseType: 'blob' });
  }
} 