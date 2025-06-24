import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Product, ProductDto, ProductPaginationResult, ProductFilter } from '../models/product.model';
import { PRODUCT_CONFIG } from './product.config';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = PRODUCT_CONFIG.apiUrl;

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

    return this.http.get<ProductPaginationResult>(this.apiUrl, { params })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}${PRODUCT_CONFIG.endpoints.product(id)}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}${PRODUCT_CONFIG.endpoints.product(id)}`, product)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${PRODUCT_CONFIG.endpoints.product(id)}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateStock(id: number, quantity: number): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}${PRODUCT_CONFIG.endpoints.stock(id)}`, { quantity })
      .pipe(
        catchError(this.handleError)
      );
  }

  getLowStockProducts(): Observable<{ $values: ProductDto[] }> {
    return this.http.get<{ $values: ProductDto[] }>(`${this.apiUrl}${PRODUCT_CONFIG.endpoints.lowStock}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getProductMovements(id: number): Observable<any> {
    return this.http.get(`${PRODUCT_CONFIG.apiUrl.replace('/Product', '/Movement')}${PRODUCT_CONFIG.endpoints.movements(id)}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getStockAlerts(): Observable<any> {
    return this.http.get(`${this.apiUrl}${PRODUCT_CONFIG.endpoints.stockAlerts}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getPriceHistory(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${PRODUCT_CONFIG.endpoints.priceHistory(id)}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error inesperado';
    
    console.error('Error completo en ProductService:', error);
    console.error('Error status:', error.status);
    console.error('Error body:', error.error);
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (typeof error.error === 'string') {
        // El backend devolvió texto plano
        errorMessage = error.error;
      } else if (error.error && typeof error.error === 'object') {
        // El backend devolvió JSON
        errorMessage = error.error.message || error.error.error || `Error del servidor: ${error.status}`;
      } else {
        // Error genérico
        errorMessage = `Error del servidor: ${error.status} - ${error.statusText}`;
      }
    }
    
    console.error('Error procesado:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 