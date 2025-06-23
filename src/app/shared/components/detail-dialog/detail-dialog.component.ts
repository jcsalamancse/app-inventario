import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return '-';
  try {
    return path.split('.').reduce((acc, part) => {
      if (acc && typeof acc === 'object' && acc[part] !== undefined) {
        return acc[part];
      }
      return null;
    }, obj);
  } catch (error) {
    console.warn('Error accessing nested value:', path, error);
    return '-';
  }
}

function formatValue(value: any, field: string): string {
  if (value === null || value === undefined || value === '') return '-';
  
  // Formatear valores booleanos
  if (typeof value === 'boolean') {
    if (field.toLowerCase().includes('active') || field.toLowerCase().includes('activo')) {
      return value ? 'Sí' : 'No';
    }
    return value ? 'Activo' : 'Inactivo';
  }
  
  // Formatear fechas
  if (field.toLowerCase().includes('date') || field.toLowerCase().includes('fecha')) {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.warn('Error formatting date:', value, error);
    }
  }
  
  // Formatear precios
  if (field.toLowerCase().includes('price') || field.toLowerCase().includes('precio')) {
    const num = Number(value);
    if (!isNaN(num)) {
      return `$${num.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }
  
  // Formatear cantidades/números
  if (field.toLowerCase().includes('stock') || field.toLowerCase().includes('quantity') || field.toLowerCase().includes('cantidad')) {
    const num = Number(value);
    if (!isNaN(num)) {
      return num.toLocaleString('es-ES');
    }
  }
  
  // Formatear tipos de alerta
  if (field.toLowerCase().includes('alerttype')) {
    if (value === 'LowStock') return 'Stock Bajo';
    if (value === 'OverStock') return 'Sobre Stock';
    return value;
  }
  
  // Formatear tipos de movimiento
  if (field.toLowerCase().includes('type')) {
    if (value === 'In') return 'Entrada';
    if (value === 'Out') return 'Salida';
    return value;
  }
  
  // Formatear nombres de roles
  if (field.toLowerCase().includes('role.name')) {
    if (value === 'Admin') return 'Administrador';
    if (value === 'User') return 'Usuario';
    if (value === 'Manager') return 'Gerente';
    return value;
  }
  
  // Formatear descripciones largas
  if (field.toLowerCase().includes('description') || field.toLowerCase().includes('notes') || field.toLowerCase().includes('message')) {
    if (typeof value === 'string' && value.length > 50) {
      return value.substring(0, 50) + '...';
    }
  }
  
  return String(value);
}

@Component({
  selector: 'app-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="rounded-2xl shadow-2xl bg-white/95 text-gray-900 max-w-4xl mx-auto">
      <div class="flex items-center gap-3 px-8 pt-6 pb-4 border-b border-gray-200 min-h-[56px]">
        <mat-icon [ngClass]="data.iconColor" style="font-size: 2rem; min-width: 2.5rem; min-height: 2.5rem; display: flex; align-items: center;">{{ data.icon }}</mat-icon>
        <div class="flex flex-col">
          <h2 class="font-bold text-2xl leading-tight">{{ data.title }}</h2>
          <div *ngIf="data.resumen && data.resumen.precioPromedio !== undefined" class="text-blue-500 font-semibold text-base mt-1">
            Precio promedio: {{ data.resumen.precioPromedio | number:'1.2-2' }}
          </div>
          <div *ngIf="data.resumen && data.resumen.totalProductos !== undefined" class="text-green-500 font-semibold text-sm mt-1">
            Total productos: {{ data.resumen.totalProductos }}
          </div>
          <div *ngIf="data.resumen && data.resumen.totalMovimientos !== undefined" class="text-green-500 font-semibold text-sm mt-1">
            Total movimientos: {{ data.resumen.totalMovimientos }}
          </div>
          <div *ngIf="data.resumen && data.resumen.totalUsuarios !== undefined" class="text-purple-500 font-semibold text-sm mt-1">
            Total usuarios: {{ data.resumen.totalUsuarios }}
          </div>
          <div *ngIf="data.resumen && data.resumen.totalAlertas !== undefined" class="text-red-500 font-semibold text-sm mt-1">
            Total alertas: {{ data.resumen.totalAlertas }}
          </div>
          <div *ngIf="data.subtitle" class="text-gray-500 text-sm mt-1">{{ data.subtitle }}</div>
          <div class="text-gray-600 text-sm mt-1">
            Total de registros: {{ data.rows?.length || 0 }}
          </div>
        </div>
        <span class="flex-1"></span>
        <button mat-icon-button mat-dialog-close class="text-gray-500 hover:text-blue-600">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <mat-dialog-content class="px-8 py-4">
        <div class="overflow-x-auto max-h-[60vh]">
          <table class="min-w-full rounded-xl bg-white text-gray-900">
            <thead class="sticky top-0 z-10 bg-blue-50">
              <tr>
                <th *ngFor="let col of data.columns" class="px-4 py-3 border-b border-blue-100 font-semibold text-left text-base">
                  {{ col.header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="!data.rows || data.rows.length === 0">
                <td [attr.colspan]="data.columns.length" class="text-center py-8 text-gray-400">
                  <div class="flex flex-col items-center gap-2">
                    <mat-icon class="text-gray-300 text-4xl">inbox</mat-icon>
                    <span>No hay datos para mostrar</span>
                  </div>
                </td>
              </tr>
              <tr *ngFor="let row of data.rows; let i = index" [ngClass]="i % 2 === 0 ? 'bg-white' : 'bg-blue-50'">
                <td *ngFor="let col of data.columns" class="px-4 py-3 border-b border-blue-100">
                  <span [ngClass]="getCellClass(row, col.field)">
                    {{ formatValue(getNestedValue(row, col.field), col.field) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="px-8 pb-6">
        <button mat-raised-button mat-dialog-close color="primary" class="font-semibold shadow">Cerrar</button>
      </mat-dialog-actions>
    </div>
  `
})
export class DetailDialogComponent {
  getNestedValue = getNestedValue;
  formatValue = formatValue;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    // Asegurar que data tenga las propiedades necesarias
    this.data = {
      title: data?.title || 'Detalles',
      rows: data?.rows || [],
      columns: data?.columns || [],
      resumen: data?.resumen || {},
      icon: data?.icon || 'info',
      iconColor: data?.iconColor || 'text-blue-600',
      subtitle: data?.subtitle || ''
    };
    
    console.log('DetailDialog Data inicializada:', this.data);
    if (this.data.rows && this.data.rows.length > 0) {
      console.log('Sample row:', this.data.rows[0]);
    }
  }
  
  getCellClass(row: any, field: string): string {
    const value = getNestedValue(row, field);
    
    // Clases para alertas de stock
    if (field.toLowerCase().includes('alerttype')) {
      if (value === 'LowStock') return 'text-red-600 font-semibold';
      if (value === 'OverStock') return 'text-yellow-600 font-semibold';
    }
    
    // Clases para tipos de movimiento
    if (field.toLowerCase().includes('type')) {
      if (value === 'In') return 'text-green-600 font-semibold';
      if (value === 'Out') return 'text-red-600 font-semibold';
    }
    
    // Clases para stock bajo
    if (field.toLowerCase().includes('currentstock')) {
      const stock = Number(value);
      if (!isNaN(stock) && stock <= 10) return 'text-red-600 font-semibold';
      if (!isNaN(stock) && stock <= 50) return 'text-yellow-600 font-semibold';
    }
    
    // Clases para valores booleanos
    if (typeof value === 'boolean') {
      if (field.toLowerCase().includes('active') || field.toLowerCase().includes('activo')) {
        return value ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold';
      }
    }
    
    // Clases para precios
    if (field.toLowerCase().includes('price') || field.toLowerCase().includes('precio')) {
      return 'text-blue-600 font-semibold';
    }
    
    // Clases para fechas
    if (field.toLowerCase().includes('date') || field.toLowerCase().includes('fecha')) {
      return 'text-gray-600 text-sm';
    }
    
    // Clases para roles
    if (field.toLowerCase().includes('role.name')) {
      if (value === 'Admin') return 'text-purple-600 font-semibold';
      if (value === 'Manager') return 'text-blue-600 font-semibold';
      return 'text-gray-600';
    }
    
    return '';
  }
} 