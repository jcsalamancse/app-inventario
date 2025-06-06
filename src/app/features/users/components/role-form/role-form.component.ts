import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RoleService, Role } from '../../services/role.service';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCheckboxModule
  ],
  template: `
    <div class="p-6">
      <h2 mat-dialog-title>{{ data ? 'Editar Rol' : 'Nuevo Rol' }}</h2>
      <form [formGroup]="roleForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <div class="grid grid-cols-2 gap-4">
            <mat-form-field appearance="fill">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="name" placeholder="Nombre del rol">
              <mat-error *ngIf="roleForm.get('name')?.hasError('required')">
                El nombre es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Código</mat-label>
              <input matInput formControlName="code" placeholder="Código del rol">
              <mat-error *ngIf="roleForm.get('code')?.hasError('required')">
                El código es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="col-span-2">
              <mat-label>Descripción</mat-label>
              <textarea matInput formControlName="description" placeholder="Descripción del rol" rows="3"></textarea>
            </mat-form-field>

            <div class="col-span-2 flex gap-4">
              <mat-checkbox formControlName="isActive">
                Activo
              </mat-checkbox>
              <mat-checkbox formControlName="isDefault">
                Rol por defecto
              </mat-checkbox>
            </div>
          </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button type="button" (click)="onCancel()">Cancelar</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="roleForm.invalid">
            {{ data ? 'Actualizar' : 'Crear' }}
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class RoleFormComponent {
  roleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    public dialogRef: MatDialogRef<RoleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Role
  ) {
    this.roleForm = this.fb.group({
      name: [data?.name || '', [Validators.required]],
      code: [data?.code || '', [Validators.required]],
      description: [data?.description || ''],
      isActive: [data?.isActive ?? true],
      isDefault: [data?.isDefault ?? false]
    });
  }

  onSubmit(): void {
    if (this.roleForm.valid) {
      const roleData = this.roleForm.value;
      if (this.data) {
        this.roleService.updateRole(this.data.id, roleData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (error) => console.error('Error al actualizar rol', error)
        });
      } else {
        this.roleService.createRole(roleData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (error) => console.error('Error al crear rol', error)
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 