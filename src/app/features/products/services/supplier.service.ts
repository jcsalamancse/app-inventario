import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PRODUCT_CONFIG } from './product.config';

export interface Supplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = PRODUCT_CONFIG.apiUrl.replace('/Product', '/Supplier');

  constructor(private http: HttpClient) {}

  getSuppliers(): Observable<Supplier[]> {
    // Por ahora retornamos un array vacío para evitar errores
    // TODO: Implementar cuando el backend esté listo
    return of([]);
  }

  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  createSupplier(supplier: Partial<Supplier>): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier);
  }

  updateSupplier(id: number, supplier: Partial<Supplier>): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/${id}`, supplier);
  }

  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 