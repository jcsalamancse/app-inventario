import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
  iconColor?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-anim bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-xs md:max-w-md mx-auto flex flex-col items-center animate-fade-in">
      <div class="flex flex-col items-center mb-4">
        <div class="rounded-full p-4 mb-2" [ngClass]="data.iconColor || 'bg-blue-100 text-blue-500'">
          <mat-icon class="text-5xl">{{data.icon || 'help'}}</mat-icon>
        </div>
        <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{{data.title || '¿Estás seguro?'}}</h2>
      </div>
      <div class="mb-6 text-gray-700 dark:text-gray-300 text-center">{{data.message}}</div>
      <div class="flex flex-col md:flex-row justify-center gap-4 w-full">
        <button mat-stroked-button color="primary" class="w-full md:w-auto py-2 text-lg" (click)="onCancel()">
          {{data.cancelText || 'Cancelar'}}
        </button>
        <button mat-raised-button color="warn" class="w-full md:w-auto py-2 text-lg" (click)="onConfirm()">
          {{data.confirmText || 'Sí, confirmar'}}
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .dialog-anim { animation: fadeIn 0.25s cubic-bezier(0.4,0,0.2,1); }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .bg-blue-100 { background-color: #dbeafe; }
    .text-blue-500 { color: #3b82f6; }
    .text-red-500 { color: #ef4444; }
    .bg-red-100 { background-color: #fee2e2; }
    .text-green-500 { color: #22c55e; }
    .bg-green-100 { background-color: #dcfce7; }
    .text-yellow-500 { color: #eab308; }
    .bg-yellow-100 { background-color: #fef9c3; }
    .dark .bg-white { background-color: #1e293b !important; }
    .dark .text-gray-900 { color: #f1f5f9 !important; }
    .dark .text-gray-700 { color: #cbd5e1 !important; }
    .dark .text-gray-300 { color: #94a3b8 !important; }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
} 