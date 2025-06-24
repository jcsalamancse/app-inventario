import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductDto, ProductFilter, ProductPaginationResult } from '../../models/product.model';
import { CategoryService } from '../../../categories/services/category.service';
import { DashboardService } from '../../../dashboard/services/dashboard.service';
import { getDotNetArray } from '../../../../shared/utils/dotnet-helpers';
import { CorporateModalComponent, ModalConfig, ModalButton } from '../../../../shared/components/corporate-modal/corporate-modal.component';
import { ConfirmDialogComponent, ConfirmDialogConfig } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ProductFormComponent } from '../product-form/product-form.component';

// Interfaces locales
export interface ProductStats {
  totalProducts: number;
  lowStockCount: number;
  activeProducts: number;
  totalValue: number;
}

export interface ProductFilters {
  searchTerm?: string;
  categoryId?: number[];
  priceRange?: string;
  status?: string;
}

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CorporateModalComponent, ConfirmDialogComponent, ProductFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gradient-to-br from-[#13131f] to-[#1c1c2c]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-slate-900">Gestión de Productos</h1>
              <p class="mt-2 text-slate-600">Administra el inventario de productos de tu empresa</p>
            </div>
            <div class="flex items-center space-x-3">
              <button 
                (click)="openProductModal()"
                class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                type="button">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Nuevo Producto
              </button>
            </div>
          </div>
        </div>

        <!-- Estadísticas -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <!-- Total Productos -->
          <div class="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-600 mb-1">Total Productos</p>
                <p class="text-2xl font-bold text-slate-800">{{stats.totalProducts | number}}</p>
                <div class="mt-2 flex items-center text-xs text-slate-500">
                  <span class="w-2 h-2 bg-slate-400 rounded-full mr-2"></span>
                  Inventario completo
                </div>
              </div>
              <div class="bg-slate-200 p-3 rounded-lg">
                <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Stock Bajo -->
          <div class="bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-amber-700 mb-1">Stock Bajo</p>
                <p class="text-2xl font-bold text-amber-800">{{stats.lowStockCount | number}}</p>
                <div class="mt-2 flex items-center text-xs text-amber-600">
                  <span class="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                  Requiere atención
                </div>
              </div>
              <div class="bg-amber-200 p-3 rounded-lg">
                <svg class="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Productos Activos -->
          <div class="bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-emerald-700 mb-1">Activos</p>
                <p class="text-2xl font-bold text-emerald-800">{{stats.activeProducts | number}}</p>
                <div class="mt-2 flex items-center text-xs text-emerald-600">
                  <span class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  Disponibles
                </div>
              </div>
              <div class="bg-emerald-200 p-3 rounded-lg">
                <svg class="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Valor Total -->
          <div class="bg-gradient-to-br from-indigo-50 to-blue-100 border border-indigo-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-indigo-700 mb-1">Valor Total</p>
                <p class="text-2xl font-bold text-indigo-800">{{stats.totalValue | currency:'USD':'symbol':'1.0-0'}}</p>
                <div class="mt-2 flex items-center text-xs text-indigo-600">
                  <span class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  Valor de inventario
                </div>
              </div>
              <div class="bg-indigo-200 p-3 rounded-lg">
                <svg class="w-6 h-6 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtros -->
        <div class="bg-white border border-slate-200 rounded-lg shadow-sm mb-6">
          <div class="px-6 py-4 border-b border-slate-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="bg-slate-100 p-2 rounded-lg">
                  <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-slate-900">Filtros Avanzados</h3>
                  <p class="text-sm text-slate-500">Refina tu búsqueda de productos</p>
                </div>
              </div>
              <button 
                (click)="clearFilters()"
                class="text-sm text-slate-500 hover:text-slate-700 transition-colors duration-200"
                type="button">
                Limpiar filtros
              </button>
            </div>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Búsqueda -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-700">Buscar</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    [(ngModel)]="filters.searchTerm"
                    (input)="onFiltersChange()"
                    placeholder="Buscar productos..."
                    class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 placeholder-slate-500"
                  />
                </div>
              </div>

              <!-- Categoría -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-700">Categoría</label>
                <select
                  [(ngModel)]="filters.categoryId"
                  (change)="onFiltersChange()"
                  class="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 bg-white"
                >
                  <option value="">Todas las categorías</option>
                  <option *ngFor="let category of categories" [value]="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <!-- Rango de Precios -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-700">Rango de Precios</label>
                <select
                  [(ngModel)]="filters.priceRange"
                  (change)="onFiltersChange()"
                  class="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 bg-white"
                >
                  <option value="">Todos los precios</option>
                  <option value="0-100">$0 - $100</option>
                  <option value="100-500">$100 - $500</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000+">$1,000+</option>
                </select>
              </div>

              <!-- Estado -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-700">Estado</label>
                <select
                  [(ngModel)]="filters.status"
                  (change)="onFiltersChange()"
                  class="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 bg-white"
                >
                  <option value="">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla -->
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
                (click)="openProductModal()"
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
              (click)="openProductModal()"
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
                        <div class="text-sm font-medium text-slate-900">{{ product.name }}</div>
                        <div class="text-sm text-slate-500">{{ product.description || 'Sin descripción' }}</div>
                      </div>
                    </div>
                  </td>

                  <!-- Precio -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-slate-900">{{ product.price | currency:'USD':'symbol':'1.2-2' }}</div>
                  </td>

                  <!-- Stock -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <span class="text-sm font-medium text-slate-900">{{ product.currentStock }}</span>
                      <span class="text-xs text-slate-500">/ {{ product.maximumStock }}</span>
                      <div class="flex-1 w-16">
                        <div class="bg-slate-200 rounded-full h-2">
                          <div 
                            class="h-2 rounded-full transition-all duration-300"
                            [class]="getStockColor(product.currentStock, product.minimumStock)"
                            [style.width.%]="getStockPercentage(product.currentStock, product.maximumStock)">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="text-xs text-slate-500 mt-1">
                      Mín: {{ product.minimumStock }}
                    </div>
                  </td>

                  <!-- Categoría -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {{ product.categoryName || 'Sin categoría' }}
                    </span>
                  </td>

                  <!-- Estado -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [class]="product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      <span class="w-1.5 h-1.5 rounded-full mr-1.5"
                            [class]="product.isActive ? 'bg-green-400' : 'bg-red-400'"></span>
                      {{ product.isActive ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>

                  <!-- Acciones -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2">
                      <button 
                        (click)="editProduct(product)"
                        class="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                        title="Editar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button 
                        (click)="deleteProduct(product)"
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
                  (click)="onPageChange(currentPage - 1)"
                  [disabled]="currentPage === 1"
                  class="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  type="button">
                  Anterior
                </button>
                <span class="px-3 py-1 text-sm text-slate-700">
                  Página {{ currentPage }} de {{ totalPages }}
                </span>
                <button 
                  (click)="onPageChange(currentPage + 1)"
                  [disabled]="currentPage === totalPages"
                  class="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  type="button">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modales -->
        <app-corporate-modal
          *ngIf="showProductModal"
          [isOpen]="showProductModal"
          [config]="productModalConfig"
          (onClose)="closeProductModal()"
          (onAction)="handleProductModalAction($event)">
          <app-product-form
            [product]="editingProduct"
            (onSave)="onProductSaved($event)"
            (onCancel)="closeProductModal()">
          </app-product-form>
        </app-corporate-modal>

        <app-confirm-dialog
          *ngIf="showDeleteModal"
          [isOpen]="showDeleteModal"
          [config]="deleteModalConfig"
          [loading]="deleting"
          (onConfirm)="confirmDeleteProduct()"
          (onCancel)="closeDeleteModal()">
        </app-confirm-dialog>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductsListComponent implements OnInit {
  // Datos
  products: ProductDto[] = [];
  categories: any[] = [];
  stats: ProductStats = {
    totalProducts: 0,
    lowStockCount: 0,
    activeProducts: 0,
    totalValue: 0
  };

  // Estado
  loading = false;
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  pageSize = 10;
  filters: ProductFilters = {};
  showProductModal = false;
  showDeleteModal = false;
  productModalConfig: ModalConfig = { title: '', showFooter: false };
  deleteModalConfig: ConfirmDialogConfig = { title: '', message: '', type: 'danger', confirmText: 'Eliminar', cancelText: 'Cancelar' };
  editingProduct: any = null;
  deleting = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private dashboardService: DashboardService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
    this.loadStatistics();
  }

  // Carga de datos
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = getDotNetArray(response);
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  loadProducts() {
    console.log('Iniciando carga de productos...');
    this.loading = true;
    const filter: ProductFilter = {
      ...this.filters,
      page: this.currentPage,
      pageSize: this.pageSize
    };

    console.log('Filtros aplicados:', filter);

    this.productService.getProducts(filter).subscribe({
      next: (response: ProductPaginationResult) => {
        console.log('Respuesta del backend:', response);
        let items = response.Items;
        let mappedProducts: any[] = [];
        if (items && Array.isArray(items.$values)) {
          mappedProducts = items.$values.map((p: any) => ({
            id: p.Id,
            name: p.Name,
            code: p.Code,
            sku: p.Sku,
            description: p.Description,
            price: p.Price,
            currentStock: p.CurrentStock,
            categoryId: p.CategoryId,
            categoryName: p.CategoryName,
            unitId: p.UnitId,
            unitName: p.UnitName,
            unitSymbol: p.UnitSymbol,
            minimumStock: p.MinimumStock,
            maximumStock: p.MaximumStock,
            isActive: p.IsActive,
            createdAt: p.CreatedAt,
            updatedAt: p.UpdatedAt,
            supplierId: p.SupplierId,
            warehouseId: p.WarehouseId,
            locationId: p.LocationId
          }));
        } else if (Array.isArray(items)) {
          mappedProducts = items;
        }
        this.products = mappedProducts;
        console.log('Productos mapeados:', this.products);
        this.totalItems = response.TotalCount;
        this.totalPages = response.TotalPages;
        this.loading = false;
        this.loadStatistics();
        this.cd.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.products = [];
        this.loading = false;
        this.cd.markForCheck();
      }
    });
  }

  loadStatistics() {
    this.stats = {
      totalProducts: this.products.length,
      lowStockCount: this.products.filter(p => p.currentStock <= p.minimumStock).length,
      activeProducts: this.products.filter(p => p.isActive).length,
      totalValue: this.products.reduce((sum, p) => sum + (p.price * p.currentStock), 0)
    };
  }

  // Eventos de filtros
  onFiltersChange() {
    this.currentPage = 1;
    this.loadProducts();
  }

  clearFilters() {
    this.filters = {};
    this.onFiltersChange();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  // Gestión de productos
  openProductModal(product: any = null) {
    console.log('Abriendo modal con producto:', product);
    
    // Solo actualizar si es un producto diferente o si no hay producto actual
    if (!this.editingProduct || this.editingProduct?.id !== product?.id) {
      this.editingProduct = product;
    }
    
    this.productModalConfig = {
      title: product ? 'Editar Producto' : 'Nuevo Producto',
      size: 'lg',
      showCloseButton: true,
      showFooter: false
    };
    this.showProductModal = true;
  }

  closeProductModal() {
    this.showProductModal = false;
    // No limpiar editingProduct inmediatamente para evitar recreaciones
    // Se limpiará cuando se abra un nuevo modal
  }

  onProductSaved(product: any) {
    console.log('Producto guardado:', product);
    this.closeProductModal();
    // Limpiar el producto de edición después de guardar
    this.editingProduct = null;
    
    // Agregar delay para asegurar que el backend haya procesado la creación
    setTimeout(() => {
      console.log('Recargando productos...');
      this.loadProducts();
      // Forzar detección de cambios para Angular 19 con OnPush
      setTimeout(() => {
        this.cd.markForCheck();
      }, 100);
    }, 500);
  }

  handleProductModalAction(action: string) {
    if (action === 'save') {
      // El formulario maneja el guardado
    } else if (action === 'cancel') {
      this.closeProductModal();
    }
  }

  editProduct(product: ProductDto) {
    console.log('Editando producto:', product);
    this.openProductModal(product);
  }

  openDeleteModal(product: any) {
    this.editingProduct = product;
    this.deleteModalConfig = {
      title: 'Eliminar Producto',
      message: `¿Está seguro de que desea eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`,
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    };
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.editingProduct = null;
  }

  deleteProduct(product: any) {
    this.openDeleteModal(product);
  }

  confirmDeleteProduct() {
    if (!this.editingProduct) return;
    this.deleting = true;
    this.productService.deleteProduct(this.editingProduct.id).subscribe({
      next: () => {
        this.deleting = false;
        this.closeDeleteModal();
        this.loadProducts();
      },
      error: (error) => {
        this.deleting = false;
        this.closeDeleteModal();
        console.error('Error al eliminar producto:', error);
      }
    });
  }

  // Utilidades
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