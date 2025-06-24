import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProductStats {
  totalProducts: number;
  lowStockCount: number;
  activeProducts: number;
  totalValue: number;
}

@Component({
  selector: 'app-product-stats',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Total Productos -->
      <div class="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-slate-600 mb-1">Total Productos</p>
            <p class="text-2xl font-bold text-slate-800">{{ stats.totalProducts | number }}</p>
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
            <p class="text-2xl font-bold text-amber-800">{{ stats.lowStockCount | number }}</p>
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
            <p class="text-2xl font-bold text-emerald-800">{{ stats.activeProducts | number }}</p>
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
            <p class="text-2xl font-bold text-indigo-800">{{ stats.totalValue | currency:'USD':'symbol':'1.0-0' }}</p>
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
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductStatsComponent {
  @Input() stats!: ProductStats;
} 