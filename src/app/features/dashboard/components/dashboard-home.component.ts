import { Component, inject } from '@angular/core';
import { KpiWidgetComponent } from './kpi-widget.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgChartsModule } from 'ng2-charts';
import { DashboardService } from '../services/dashboard.service';
import { map } from 'rxjs/operators';
import { ChartConfiguration, ChartOptions } from 'chart.js';

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
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
      <app-kpi-widget
        [icon]="'inventory_2'"
        [iconColor]="'text-blue-400'"
        [iconBg]="'bg-blue-500/20'"
        [value]="getKpiValue(productosKpi$ | async)"
        label="Total Productos"
        trend="+12%">
      </app-kpi-widget>
      <app-kpi-widget
        [icon]="'swap_horiz'"
        [iconColor]="'text-green-400'"
        [iconBg]="'bg-green-500/20'"
        [value]="getKpiValue(movimientosKpi$ | async)"
        label="Movimientos"
        trend="+8%">
      </app-kpi-widget>
      <app-kpi-widget
        [icon]="'people'"
        [iconColor]="'text-purple-400'"
        [iconBg]="'bg-purple-500/20'"
        [value]="getKpiValue(usuariosKpi$ | async)"
        label="Usuarios Activos"
        trend="+5%">
      </app-kpi-widget>
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
                  <td class="py-3">{{ movimiento.producto ?? movimiento.name ?? movimiento.ProductName }}</td>
                  <td class="py-3">
                    <span [ngClass]="{
                      'bg-green-500/20 text-green-400': movimiento.tipo === 'Entrada' || movimiento.type === 'Entrada',
                      'bg-red-500/20 text-red-400': movimiento.tipo === 'Salida' || movimiento.type === 'Salida'
                    }" class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ movimiento.tipo ?? movimiento.type }}
                    </span>
                  </td>
                  <td class="py-3">{{ movimiento.cantidad ?? movimiento.quantity }}</td>
                  <td class="py-3 text-sm">{{ (movimiento.fecha ?? movimiento.date ?? movimiento.createdAt) | date:'short' }}</td>
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
  `
})
export class DashboardHomeComponent {
  dashboardService = inject(DashboardService);
  productosKpi$ = this.dashboardService.getTopProducts();
  movimientosKpi$ = this.dashboardService.getRecentMovements();
  usuariosKpi$ = this.dashboardService.getTopSuppliers();
  movimientos$ = this.dashboardService.getRecentMovements();

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

  constructor() {
    this.movimientos$.pipe(
      map(movs => this.getMovimientosArray(movs))
    ).subscribe(movimientos => {
      const meses: { [key: string]: number } = {};
      for (const mov of movimientos) {
        const fecha = new Date(mov.fecha || mov.date || mov.createdAt);
        const mes = fecha.toLocaleString('default', { month: 'short', year: '2-digit' });
        meses[mes] = (meses[mes] || 0) + 1;
      }
      this.barChartData.labels = Object.keys(meses);
      this.barChartData.datasets[0].data = Object.values(meses);
    });
  }

  getKpiValue(data: any): number {
    if (!data) return 0;
    if (Array.isArray(data)) return data.length;
    if (typeof data.total === 'number') return data.total;
    if (typeof data.count === 'number') return data.count;
    if (Array.isArray(data.$values)) return data.$values.length;
    return 0;
  }

  getMovimientosArray(data: any): any[] {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.$values)) return data.$values;
    return [];
  }
} 