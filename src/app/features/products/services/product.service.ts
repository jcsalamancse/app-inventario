import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductDto, ProductPaginationResult, ProductFilter } from '../models/product.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/Product`;

  constructor(private http: HttpClient) {}

  getProducts(filter?: ProductFilter): Observable<ProductPaginationResult> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
      if (filter.categoryId) params = params.set('categoryId', filter.categoryId.join(','));
      if (filter.supplierId) params = params.set('supplierId', filter.supplierId.join(','));
      if (filter.warehouseId) params = params.set('warehouseId', filter.warehouseId.join(','));
      if (filter.minPrice) params = params.set('minPrice', filter.minPrice.toString());
      if (filter.maxPrice) params = params.set('maxPrice', filter.maxPrice.toString());
      if (filter.stockStatus) params = params.set('stockStatus', filter.stockStatus.join(','));
      if (filter.isActive !== undefined) params = params.set('isActive', filter.isActive.toString());
      if (filter.createdFrom) params = params.set('createdFrom', filter.createdFrom.toISOString());
      if (filter.createdTo) params = params.set('createdTo', filter.createdTo.toISOString());
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
      if (filter.sortOrder) params = params.set('sortOrder', filter.sortOrder);
      if (filter.page) params = params.set('page', filter.page.toString());
      if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
    }

    return this.http.get<ProductPaginationResult>(this.apiUrl, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateStock(id: number, quantity: number): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/stock`, { quantity });
  }

  getLowStockProducts(): Observable<{ $values: ProductDto[] }> {
    return this.http.get<{ $values: ProductDto[] }>(`${this.apiUrl}/low-stock`);
  }

  getProductMovements(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/Movement/product/${id}`);
  }

  getStockAlerts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stock-alerts`);
  }

  getPriceHistory(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/price-history`);
  }
} 