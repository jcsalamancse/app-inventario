import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-menu-overlay',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="w-64 bg-[#1a1a2e] rounded-2xl shadow-2xl border border-white/10 py-3">
      <div class="px-5 py-3 border-b border-white/10 mb-1">
        <p class="text-base font-semibold text-white truncate">{{ username || 'Usuario' }}</p>
        <p class="text-xs text-white/60 truncate">{{ email || 'usuario@ejemplo.com' }}</p>
      </div>
      <button mat-button class="w-full text-left px-5 py-3 hover:bg-white/5 text-white/80 flex items-center gap-2 transition-colors" (click)="changePassword.emit()">
        <mat-icon fontIcon="lock" class="text-white/60"></mat-icon>
        <span>Cambiar contraseña</span>
      </button>
      <button mat-button class="w-full text-left px-5 py-3 flex items-center gap-2 text-red-400 hover:bg-red-500/10 transition-colors font-semibold" (click)="logout.emit()">
        <mat-icon fontIcon="logout" class="text-red-400"></mat-icon>
        <span>Cerrar sesión</span>
      </button>
    </div>
  `
})
export class UserMenuOverlayComponent {
  @Input() username: string | null = null;
  @Input() email: string | null = null;
  @Output() changePassword = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
} 