import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDto } from '../../models/product.model';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      <!-- Header de la tabla -->
      <div class="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="bg-slate-200 p-2 rounded-lg">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-slate-900">Lista de Productos</h3>
              <p class="text-sm text-slate-500">{{ products.length }} productos encontrados</p>
            </div>
          </div>
          <button 
            (click)="onAddProduct.emit()"
            class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            type="button">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Nuevo Producto
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-12">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span class="text-slate-600">Cargando productos...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && products.length === 0" class="text-center py-12">
        <div class="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-slate-900 mb-2">No hay productos</h3>
        <p class="text-slate-500 mb-4">Comienza agregando tu primer producto al inventario.</p>
        <button 
          (click)="onAddProduct.emit()"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          type="button">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Agregar Producto
        </button>
      </div>

      <!-- Table -->
      <div *ngIf="!loading && products.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Producto</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Precio</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Categoría</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            <tr *ngFor="let product of products" class="hover:bg-slate-50 transition-colors duration-150">
              <!-- Producto -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-lg bg-slate-200 flex items-center justify-center">
                      <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-slate-900">{{ product.Name }}</div>
                    <div class="text-sm text-slate-500">{{ product.Description || 'Sin descripción' }}</div>
                  </div>
                </div>
              </td>

              <!-- Precio -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-slate-900">{{ product.Price | currency:'USD':'symbol':'1.2-2' }}</div>
              </td>

              <!-- Stock -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-medium text-slate-900">{{ product.CurrentStock }}</span>
                  <span class="text-xs text-slate-500">/ {{ product.MaximumStock }}</span>
                  <div class="flex-1 w-16">
                    <div class="bg-slate-200 rounded-full h-2">
                      <div 
                        class="h-2 rounded-full transition-all duration-300"
                        [class]="getStockColor(product.CurrentStock, product.MinimumStock)"
                        [style.width.%]="getStockPercentage(product.CurrentStock, product.MaximumStock)">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="text-xs text-slate-500 mt-1">
                  Mín: {{ product.MinimumStock }}
                </div>
              </td>

              <!-- Categoría -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                  {{ product.CategoryName || 'Sin categoría' }}
                </span>
              </td>

              <!-- Estado -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  [class]="product.IsActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5"
                        [class]="product.IsActive ? 'bg-green-400' : 'bg-red-400'"></span>
                  {{ product.IsActive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>

              <!-- Acciones -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button 
                    (click)="onEditProduct.emit(product)"
                    class="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                    title="Editar">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button 
                    (click)="onDeleteProduct.emit(product)"
                    class="text-red-600 hover:text-red-900 transition-colors duration-200"
                    title="Eliminar">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div *ngIf="!loading && products.length > 0" class="px-6 py-3 border-t border-slate-200 bg-slate-50">
        <div class="flex items-center justify-between">
          <div class="text-sm text-slate-700">
            Mostrando {{ startIndex + 1 }} a {{ endIndex }} de {{ totalItems }} resultados
          </div>
          <div class="flex items-center space-x-2">
            <button 
              (click)="onPageChange.emit(currentPage - 1)"
              [disabled]="currentPage === 1"
              class="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              type="button">
              Anterior
            </button>
            <span class="px-3 py-1 text-sm text-slate-700">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            <button 
              (click)="onPageChange.emit(currentPage + 1)"
              [disabled]="currentPage === totalPages"
              class="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              type="button">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductTableComponent {
  @Input() products: ProductDto[] = [];
  @Input() loading = false;
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() totalItems = 0;
  @Input() pageSize = 10;

  @Output() onAddProduct = new EventEmitter<void>();
  @Output() onEditProduct = new EventEmitter<ProductDto>();
  @Output() onDeleteProduct = new EventEmitter<ProductDto>();
  @Output() onPageChange = new EventEmitter<number>();

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.totalItems);
  }

  getStockColor(currentStock: number, minimumStock: number): string {
    if (currentStock <= minimumStock) return 'bg-red-500';
    if (currentStock <= minimumStock * 1.5) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  getStockPercentage(currentStock: number, maximumStock: number): number {
    if (maximumStock === 0) return 0;
    return Math.min((currentStock / maximumStock) * 100, 100);
  }
} 