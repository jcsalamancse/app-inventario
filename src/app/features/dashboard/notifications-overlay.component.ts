import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-notifications-overlay',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="mt-16 mr-8 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[99999]">
      <div class="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
        <h3 class="font-semibold text-gray-800">Notificaciones</h3>
        <button mat-icon-button (click)="close.emit()">
          <mat-icon fontIcon="close"></mat-icon>
        </button>
      </div>
      <div class="max-h-96 overflow-y-auto">
        <button class="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
          <p class="text-sm font-medium text-gray-800">Nuevo movimiento registrado</p>
          <p class="text-xs text-gray-500 mt-1">Hace 5 minutos</p>
        </button>
        <button class="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
          <p class="text-sm font-medium text-gray-800">Stock bajo en producto</p>
          <p class="text-xs text-gray-500 mt-1">Hace 1 hora</p>
        </button>
        <button class="w-full text-left px-4 py-3 hover:bg-gray-50">
          <p class="text-sm font-medium text-gray-800">Nuevo usuario registrado</p>
          <p class="text-xs text-gray-500 mt-1">Hace 2 horas</p>
        </button>
      </div>
    </div>
  `
})
export class NotificationsOverlayComponent {
  @Output() close = new EventEmitter<void>();
} 