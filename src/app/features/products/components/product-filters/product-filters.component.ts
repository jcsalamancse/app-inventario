import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ProductFilters {
  searchTerm?: string;
  categoryId?: string;
  priceRange?: string;
  status?: string;
}

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductFiltersComponent {
  @Input() filters: ProductFilters = {};
  @Input() categories: any[] = [];
  @Output() filtersChange = new EventEmitter<ProductFilters>();

  onFiltersChange() {
    this.filtersChange.emit(this.filters);
  }

  clearFilters() {
    this.filters = {
      searchTerm: '',
      categoryId: '',
      priceRange: '',
      status: ''
    };
    this.filtersChange.emit(this.filters);
  }
} 