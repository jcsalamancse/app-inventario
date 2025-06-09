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
    <div class="p-6 text-center">
      <div class="flex flex-col items-center mb-4">
        <mat-icon [ngClass]="data.iconColor || 'text-blue-500'" class="text-5xl mb-2">{{data.icon || 'help'}}</mat-icon>
        <h2 class="text-xl font-bold mb-2">{{data.title || '¿Estás seguro?'}}</h2>
      </div>
      <div class="mb-6 text-gray-700">{{data.message}}</div>
      <div class="flex justify-center gap-4">
        <button mat-stroked-button color="primary" (click)="onCancel()">{{data.cancelText || 'Cancelar'}}</button>
        <button mat-raised-button color="warn" (click)="onConfirm()">{{data.confirmText || 'Sí, confirmar'}}</button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; max-width: 350px; }
    .text-blue-500 { color: #3b82f6; }
    .text-red-500 { color: #ef4444; }
    .text-green-500 { color: #22c55e; }
    .text-yellow-500 { color: #eab308; }
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