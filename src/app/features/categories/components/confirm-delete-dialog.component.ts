import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-6 text-center">
      <div class="flex justify-center mb-4">
        <mat-icon class="text-red-500 text-5xl">warning</mat-icon>
      </div>
      <h2 class="text-xl font-bold mb-2 text-gray-800">¿Confirmar eliminación?</h2>
      <p class="mb-6 text-gray-600">{{ data.message || '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.' }}</p>
      <div class="flex justify-center gap-4">
        <button mat-stroked-button color="primary" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="warn" (click)="onConfirm()">Eliminar</button>
      </div>
    </div>
  `
})
export class ConfirmDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message?: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
} 