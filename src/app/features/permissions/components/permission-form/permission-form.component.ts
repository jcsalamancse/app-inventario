import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Permission } from '../../models/permission.model';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-permission-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  template: `
    <div class="p-4">
      <h2 class="text-xl font-semibold mb-4">
        {{data ? 'Editar Permiso' : 'Nuevo Permiso'}}
      </h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field class="w-full mb-4">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" required>
          <mat-error *ngIf="form.get('name')?.hasError('required')">
            El nombre es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-full mb-4">
          <mat-label>Código</mat-label>
          <input matInput formControlName="code">
        </mat-form-field>

        <mat-form-field class="w-full mb-4">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field class="w-full mb-4">
          <mat-label>Módulo</mat-label>
          <input matInput formControlName="module">
        </mat-form-field>

        <div class="flex justify-end gap-2">
          <button mat-button type="button" (click)="onCancel()">
            Cancelar
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
            {{data ? 'Actualizar' : 'Crear'}}
          </button>
        </div>
      </form>
    </div>
  `
})
export class PermissionFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PermissionFormComponent>,
    private permissionService: PermissionService,
    @Inject(MAT_DIALOG_DATA) public data?: Permission
  ) {
    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      code: [data?.code || ''],
      description: [data?.description || ''],
      module: [data?.module || '']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const permission: Permission = {
        id: this.data?.id || 0,
        ...this.form.value
      };

      if (this.data) {
        this.permissionService.updatePermission(permission).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: () => {
            // Manejar error
          }
        });
      } else {
        this.permissionService.createPermission(permission).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: () => {
            // Manejar error
          }
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 