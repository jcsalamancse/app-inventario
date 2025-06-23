import { Component, inject } from '@angular/core';
import { KpiWidgetComponent } from './kpi-widget.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgChartsModule } from 'ng2-charts';
import { DashboardService } from '../services/dashboard.service';
import { map, take } from 'rxjs/operators';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { getDotNetArray } from '../../../shared/utils/dotnet-helpers';
import { MatDialog } from '@angular/material/dialog';
import { DetailDialogComponent } from '../../../shared/components/detail-dialog/detail-dialog.component';
import { UserService } from '../../users/services/user.service';
import { ProductService } from '../../products/services/product.service';

export function extractArray(data: any, path?: string): any[] {
  console.log('extractArray input:', { data, path });
  
  if (!data) {
    console.log('Data is null/undefined');
    return [];
  }
  
  // Si se especifica un path, navegar por la estructura
  if (path) {
    const parts = path.split('.');
    let value = data;
    
    for (const part of parts) {
      console.log(`Navigating to part: ${part}, current value:`, value);
      if (value && typeof value === 'object' && value[part] !== undefined) {
        value = value[part];
      } else {
        console.log(`Part ${part} not found or undefined, trying alternative paths...`);
        // Si no encontramos la parte, intentar alternativas
        if (part === '$values' && value && typeof value === 'object') {
          // Si estamos buscando $values pero no existe, devolver el valor actual si es array
          if (Array.isArray(value)) {
            console.log('Found array directly instead of $values, length:', value.length);
            return value;
          }
        }
        return [];
      }
    }
    
    console.log('Final value after path navigation:', value);
    
    // Procesar el valor final
    if (Array.isArray(value)) {
      console.log('Value is already an array, length:', value.length);
      return value;
    }
    if (value && Array.isArray(value.$values)) {
      console.log('Value has $values array, length:', value.$values.length);
      return value.$values;
    }
    if (value && Array.isArray(value.items)) {
      console.log('Value has items array, length:', value.items.length);
      return value.items;
    }
    if (value && Array.isArray(value.data)) {
      console.log('Value has data array, length:', value.data.length);
      return value.data;
    }
    
    console.log('Value is not an array or has no known array property');
    return [];
  }
  
  // Sin path especificado, intentar diferentes estructuras comunes
  if (Array.isArray(data)) {
    console.log('Data is already an array, length:', data.length);
    return data;
  }
  
  if (data && Array.isArray(data.$values)) {
    console.log('Data has $values array, length:', data.$values.length);
    return data.$values;
  }
  
  if (data && Array.isArray(data.items)) {
    console.log('Data has items array, length:', data.items.length);
    return data.items;
  }
  
  if (data && Array.isArray(data.data)) {
    console.log('Data has data array, length:', data.data.length);
    return data.data;
  }
  
  if (data && Array.isArray(data.Items)) {
    console.log('Data has Items array, length:', data.Items.length);
    return data.Items;
  }
  
  if (data && Array.isArray(data.Results)) {
    console.log('Data has Results array, length:', data.Results.length);
    return data.Results;
  }
  
  console.log('Data is not an array or has no known array property');
  return [];
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, KpiWidgetComponent, MatIconModule, MatProgressSpinnerModule, NgChartsModule],
  template: `
    <div class="mb-8">
      <div class="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 transition-all duration-200">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 class="text-xl sm:text-2xl font-semibold text-white mb-2">Panel de control</h2>
            <p class="text-purple-200 text-sm sm:text-base">Gestiona tu inventario, usuarios y reportes desde un solo lugar.</p>
          </div>
          <div class="flex gap-3">
            <button class="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
              <mat-icon fontIcon="download" class="text-lg"></mat-icon>
              <span>Exportar</span>
            </button>
            <button class="bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
              <mat-icon fontIcon="refresh" class="text-lg"></mat-icon>
              <span>Actualizar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      <app-kpi-widget
        [icon]="'inventory_2'"
        [iconColor]="'text-blue-400'"
        [iconBg]="'bg-blue-500/20'"
        [value]="getKpiValue(productosKpi$ | async)"
        label="Total Productos"
        trend="+12%"
        (click)="openProductosDetail()"
        class="cursor-pointer"
      ></app-kpi-widget>
      <app-kpi-widget
        [icon]="'swap_horiz'"
        [iconColor]="'text-green-400'"
        [iconBg]="'bg-green-500/20'"
        [value]="getKpiValue(movimientosKpi$ | async)"
        label="Movimientos"
        trend="+8%"
        (click)="openMovimientosDetail()"
        class="cursor-pointer"
      ></app-kpi-widget>
      <app-kpi-widget
        [icon]="'people'"
        [iconColor]="'text-purple-400'"
        [iconBg]="'bg-purple-500/20'"
        [value]="getKpiValue(usuariosKpi$ | async)"
        label="Usuarios Activos"
        trend="+5%"
        (click)="openUsuariosDetail()"
        class="cursor-pointer"
      ></app-kpi-widget>
      <app-kpi-widget
        [icon]="'warning'"
        [iconColor]="'text-red-400'"
        [iconBg]="'bg-red-500/20'"
        [value]="getStockAlertsCount(stockAlerts$ | async)"
        label="Alertas de Stock"
        trend=""
        (click)="openStockAlertsDetail()"
        class="cursor-pointer"
      ></app-kpi-widget>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div class="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white">Movimientos por mes</h3>
          <div class="flex gap-2">
            <button class="bg-white/10 hover:bg-white/20 text-white text-xs font-medium py-1 px-3 rounded-lg transition-colors">
              Mensual
            </button>
            <button class="bg-white/10 hover:bg-white/20 text-white text-xs font-medium py-1 px-3 rounded-lg transition-colors">
              Anual
            </button>
          </div>
        </div>
        <div class="h-[300px]">
          <canvas baseChart
            [data]="barChartData"
            [options]="barChartOptions"
            [type]="'bar'">
          </canvas>
        </div>
      </div>
      <div class="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white">Movimientos recientes</h3>
          <button class="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
            Ver todos
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-sm text-purple-200 border-b border-white/10">
                <th class="pb-3 font-medium">Producto</th>
                <th class="pb-3 font-medium">Tipo</th>
                <th class="pb-3 font-medium">Cantidad</th>
                <th class="pb-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              <ng-container *ngIf="movimientos$ | async as movimientos; else loadingOrEmpty">
                <tr *ngIf="getMovimientosArray(movimientos).length === 0" class="text-white/60">
                  <td colspan="4" class="py-4 text-center">
                    No hay movimientos recientes
                  </td>
                </tr>
                <tr *ngFor="let movimiento of getMovimientosArray(movimientos)" class="text-white/80 border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td class="py-3">{{ movimiento.ProductName }}</td>
                  <td class="py-3">{{ movimiento.Type }}</td>
                  <td class="py-3">{{ movimiento.Quantity }}</td>
                  <td class="py-3 text-sm">{{ movimiento.Date | date:'short' }}</td>
                </tr>
              </ng-container>
              <ng-template #loadingOrEmpty>
                <tr class="text-white/60">
                  <td colspan="4" class="py-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                      <mat-spinner diameter="20"></mat-spinner>
                      <span>Cargando movimientos...</span>
                    </div>
                  </td>
                </tr>
              </ng-template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="mt-6">
      <div class="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white">Alertas de Stock</h3>
          <button class="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
            Ver todas
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-sm text-purple-200 border-b border-white/10">
                <th class="pb-3 font-medium">Producto</th>
                <th class="pb-3 font-medium">Stock Actual</th>
                <th class="pb-3 font-medium">Mínimo</th>
                <th class="pb-3 font-medium">Máximo</th>
                <th class="pb-3 font-medium">Tipo de Alerta</th>
                <th class="pb-3 font-medium">Mensaje</th>
              </tr>
            </thead>
            <tbody>
              <ng-container *ngIf="stockAlerts$ | async as alerts; else loadingAlerts">
                <tr *ngIf="getStockAlertsArray(alerts).length === 0" class="text-white/60">
                  <td colspan="6" class="py-4 text-center">
                    No hay alertas de stock
                  </td>
                </tr>
                <tr *ngFor="let alert of getStockAlertsArray(alerts)" class="text-white/80 border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td class="py-3">{{ alert.ProductName }}</td>
                  <td class="py-3">{{ alert.CurrentStock }}</td>
                  <td class="py-3">{{ alert.MinimumStock }}</td>
                  <td class="py-3">{{ alert.MaximumStock }}</td>
                  <td class="py-3">
                    <span [class]="alert.AlertType === 'LowStock' ? 'text-red-400' : 'text-yellow-400'" class="font-medium">
                      {{ alert.AlertType === 'LowStock' ? 'Stock Bajo' : 'Sobre Stock' }}
                    </span>
                  </td>
                  <td class="py-3 text-sm">{{ alert.Message }}</td>
                </tr>
              </ng-container>
              <ng-template #loadingAlerts>
                <tr class="text-white/60">
                  <td colspan="6" class="py-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                      <mat-spinner diameter="20"></mat-spinner>
                      <span>Cargando alertas...</span>
                    </div>
                  </td>
                </tr>
              </ng-template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class DashboardHomeComponent {
  dashboardService = inject(DashboardService);
  userService = inject(UserService);
  productService = inject(ProductService);
  dialog = inject(MatDialog);
  productosKpi$ = this.productService.getProducts().pipe(map(res => res.Items?.$values ?? []));
  movimientosKpi$ = this.dashboardService.getRecentMovements();
  usuariosKpi$ = this.userService.getUsers().pipe(map(users => users.filter(u => u.IsActive)));
  movimientos$ = this.dashboardService.getRecentMovements();
  stockAlerts$ = this.dashboardService.getStockAlerts();

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Movimientos', backgroundColor: '#3b82f6' }
    ]
  };
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Movimientos por mes', color: '#fff', font: { size: 18 } },
      tooltip: {
        enabled: true,
        backgroundColor: '#23234a',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return ` Movimientos: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#fff', font: { weight: 'bold' } },
        grid: { color: '#8882' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#fff', font: { weight: 'bold' } },
        grid: { color: '#8882' }
      }
    }
  };

  productosColumns = [
    { field: 'Name', header: 'Producto' },
    { field: 'CategoryName', header: 'Categoría' },
    { field: 'CurrentStock', header: 'Stock Actual' },
    { field: 'MinimumStock', header: 'Stock Mínimo' },
    { field: 'MaximumStock', header: 'Stock Máximo' },
    { field: 'Price', header: 'Precio' },
    { field: 'Description', header: 'Descripción' }
  ];
  
  movimientosColumns = [
    { field: 'ProductName', header: 'Producto' },
    { field: 'Type', header: 'Tipo' },
    { field: 'Quantity', header: 'Cantidad' },
    { field: 'Date', header: 'Fecha' },
    { field: 'UserName', header: 'Usuario' },
    { field: 'Notes', header: 'Notas' }
  ];
  
  usuariosColumns = [
    { field: 'UserName', header: 'Usuario' },
    { field: 'Email', header: 'Email' },
    { field: 'FirstName', header: 'Nombre' },
    { field: 'LastName', header: 'Apellido' },
    { field: 'Role.Name', header: 'Rol' },
    { field: 'IsActive', header: 'Activo' }
  ];
  
  stockAlertsColumns = [
    { field: 'ProductName', header: 'Producto' },
    { field: 'CurrentStock', header: 'Stock Actual' },
    { field: 'MinimumStock', header: 'Stock Mínimo' },
    { field: 'MaximumStock', header: 'Stock Máximo' },
    { field: 'AlertType', header: 'Tipo de Alerta' },
    { field: 'Message', header: 'Mensaje' }
  ];

  constructor() {
    this.movimientos$.pipe(
      map(movs => this.getMovimientosArray(movs))
    ).subscribe(movimientos => {
      // Generar los 12 meses del año actual
      const mesesLabels: string[] = [];
      const mesesData: number[] = [];
      const now = new Date();
      const year = now.getFullYear();

      // Inicializar todos los meses en 0
      for (let i = 0; i < 12; i++) {
        const fecha = new Date(year, i, 1);
        const mes = fecha.toLocaleString('default', { month: 'short', year: '2-digit' });
        mesesLabels.push(mes);
        mesesData.push(0);
      }

      // Agrupar movimientos por mes real
      for (const mov of movimientos) {
        const fecha = new Date(mov.Date || mov.fecha || mov.date || mov.createdAt);
        if (fecha.getFullYear() === year) {
          const mesIndex = fecha.getMonth();
          mesesData[mesIndex]++;
        }
      }

      this.barChartData.labels = mesesLabels;
      this.barChartData.datasets[0].data = mesesData;
    });
  }

  getKpiValue(data: any): number {
    const arr = getDotNetArray(data);
    return arr.length;
  }

  getMovimientosArray(data: any): any[] {
    return getDotNetArray(data);
  }

  getStockAlertsCount(data: any): number {
    return getDotNetArray(data).length;
  }

  getStockAlertsArray(data: any): any[] {
    return getDotNetArray(data);
  }

  openProductosDetail() {
    console.log('Abriendo pop-up de productos...');
    this.productosKpi$.pipe(take(1)).subscribe({
      next: (data) => {
        console.log('DATA productos completa:', data);
        const productos = extractArray(data);
        console.log('Productos extraídos:', productos);
        
        if (productos.length === 0) {
          console.warn('No se encontraron productos');
          this.openDetail(
            'Productos',
            [],
            this.productosColumns,
            { precioPromedio: 0, totalProductos: 0 },
            { icon: 'inventory_2', iconColor: 'text-blue-600' }
          );
          return;
        }
        
        const precios = productos
          .map((p: any) => Number(p.Price || p.price || 0))
          .filter((p: number) => !isNaN(p) && p > 0);
        
        const promedio = precios.length > 0 
          ? (precios.reduce((a: number, b: number) => a + b, 0) / precios.length) 
          : 0;
        
        console.log('Precio promedio calculado:', promedio);
        
        this.openDetail(
          'Productos',
          productos,
          this.productosColumns,
          { precioPromedio: promedio, totalProductos: productos.length },
          { icon: 'inventory_2', iconColor: 'text-blue-600' }
        );
      },
      error: (error) => {
        console.error('Error obteniendo productos:', error);
        this.openDetail(
          'Productos',
          [],
          this.productosColumns,
          { precioPromedio: 0, totalProductos: 0 },
          { icon: 'inventory_2', iconColor: 'text-blue-600' }
        );
      }
    });
  }

  openMovimientosDetail() {
    console.log('Abriendo pop-up de movimientos...');
    this.movimientosKpi$.pipe(take(1)).subscribe({
      next: (data) => {
        console.log('DATA movimientos completa:', data);
        const movimientos = extractArray(data);
        console.log('Movimientos extraídos:', movimientos);
        
        this.openDetail(
          'Movimientos', 
          movimientos, 
          this.movimientosColumns, 
          { totalMovimientos: movimientos.length }, 
          { icon: 'swap_horiz', iconColor: 'text-green-600' }
        );
      },
      error: (error) => {
        console.error('Error obteniendo movimientos:', error);
        this.openDetail(
          'Movimientos',
          [],
          this.movimientosColumns,
          { totalMovimientos: 0 },
          { icon: 'swap_horiz', iconColor: 'text-green-600' }
        );
      }
    });
  }

  openUsuariosDetail() {
    console.log('Abriendo pop-up de usuarios...');
    this.usuariosKpi$.pipe(take(1)).subscribe({
      next: (data) => {
        console.log('DATA usuarios completa:', data);
        const usuarios = extractArray(data);
        console.log('Usuarios extraídos:', usuarios);
        
        this.openDetail(
          'Usuarios Activos', 
          usuarios, 
          this.usuariosColumns, 
          { totalUsuarios: usuarios.length }, 
          { icon: 'people', iconColor: 'text-purple-600' }
        );
      },
      error: (error) => {
        console.error('Error obteniendo usuarios:', error);
        this.openDetail(
          'Usuarios Activos',
          [],
          this.usuariosColumns,
          { totalUsuarios: 0 },
          { icon: 'people', iconColor: 'text-purple-600' }
        );
      }
    });
  }

  openStockAlertsDetail() {
    console.log('Abriendo pop-up de alertas de stock...');
    this.stockAlerts$.pipe(take(1)).subscribe({
      next: (data) => {
        console.log('DATA alertas completa:', data);
        const alerts = extractArray(data);
        console.log('Alertas extraídas:', alerts);
        
        this.openDetail(
          'Alertas de Stock', 
          alerts, 
          this.stockAlertsColumns, 
          { totalAlertas: alerts.length }, 
          { icon: 'warning', iconColor: 'text-red-600' }
        );
      },
      error: (error) => {
        console.error('Error obteniendo alertas:', error);
        this.openDetail(
          'Alertas de Stock',
          [],
          this.stockAlertsColumns,
          { totalAlertas: 0 },
          { icon: 'warning', iconColor: 'text-red-600' }
        );
      }
    });
  }

  openDetail(title: string, rows: any[], columns: any[], resumen?: any, iconData?: { icon: string, iconColor: string }) {
    console.log(`Abriendo detalle de ${title}:`, { rows, columns, resumen, iconData });
    
    this.dialog.open(DetailDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: { title, rows, columns, resumen, ...(iconData || {}) }
    });
  }
} 