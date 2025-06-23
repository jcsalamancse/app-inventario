import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/Dashboard`;

  constructor(private http: HttpClient) {}

  getSalesChart(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sales-chart`);
  }

  getInventoryChart(): Observable<any> {
    return this.http.get(`${this.apiUrl}/inventory-chart`);
  }

  getCategoryDistribution(): Observable<any> {
    return this.http.get(`${this.apiUrl}/category-distribution`);
  }

  getAlerts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/alerts`);
  }

  getTopProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/top-products`);
  }

  getTopSuppliers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/top-suppliers`);
  }

  getInventoryStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/inventory-status`);
  }

  getFinancialSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/financial-summary`);
  }

  getStockAlerts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stock-alerts`);
  }

  getRecentMovements(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recent-movements`);
  }
} 