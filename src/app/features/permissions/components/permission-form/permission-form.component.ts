import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
          <input matInput formControlName="code" required>
          <mat-error *ngIf="form.get('code')?.hasError('required')">
            El código es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-full mb-4">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field class="w-full mb-4">
          <mat-label>Módulo</mat-label>
          <input matInput formControlName="module">
        </mat-form-field>

        <mat-form-field class="w-full mb-4">
          <mat-label>Acciones</mat-label>
          <mat-select formControlName="actions" multiple>
            <mat-option *ngFor="let action of actionList" [value]="action">
              {{action}}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="form.get('actions')?.hasError('required')">
            Selecciona al menos una acción
          </mat-error>
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
  actionList = ['CREATE', 'READ', 'UPDATE', 'DELETE'];
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PermissionFormComponent>,
    private permissionService: PermissionService,
    @Inject(MAT_DIALOG_DATA) public data?: Permission
  ) {
    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      code: [
        data?.code || '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[A-Z0-9_]+$/)
        ]
      ],
      description: [data?.description || ''],
      module: [data?.module || ''],
      actions: this.fb.array(
        this.actionList.map((a: string) => data?.action === a ? true : false),
        [Validators.required]
      )
    });
  }

  get actionsArray() {
    return this.form.get('actions') as FormArray;
  }

  onSubmit() {
    if (this.form.valid) {
      const selectedActions = this.actionList.filter((_: string, i: number) => this.actionsArray.value[i]);
      if (selectedActions.length === 0) {
        this.actionsArray.setErrors({ required: true });
        return;
      }
      const permission: Permission = {
        id: this.data?.id || 0,
        ...this.form.value,
        action: selectedActions.join(',')
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