import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RoleService, Role } from '../../../users/services/role.service';
import { PermissionService } from '../../../users/services/permission.service';
import { Permission } from '../../../users/models/permission.model';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatSnackBarModule, MatCheckboxModule, MatProgressSpinnerModule, MatSelectModule
  ],
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  permissions: Permission[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RoleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Role | null,
    private roleService: RoleService,
    private snackBar: MatSnackBar,
    private permissionService: PermissionService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.data?.name || '', [Validators.required, Validators.minLength(3)]],
      code: [this.data?.code || '', [Validators.required]],
      description: [this.data?.description || ''],
      isActive: [this.data?.isActive ?? true],
      isDefault: [this.data?.isDefault ?? false]
    });
    this.permissionService.getPermissions().subscribe(perms => this.permissions = perms);
  }

  save() {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: this.data ? 'Actualizar rol' : 'Crear rol',
        message: this.data ? '¿Deseas guardar los cambios de este rol?' : '¿Deseas crear este nuevo rol?',
        confirmText: this.data ? 'Actualizar' : 'Crear',
        cancelText: 'Cancelar',
        icon: 'save',
        iconColor: 'text-blue-500'
      } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.loading = true;
      const roleData = this.form.value;
      if (this.data) {
        // Editar rol
        this.roleService.updateRole(this.data.id, roleData).subscribe({
          next: () => {
            this.loading = false;
            this.snackBar.open('Rol actualizado correctamente', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error al actualizar rol:', error);
            this.loading = false;
            this.snackBar.open('Error al actualizar rol', 'Cerrar', { duration: 3000 });
          }
        });
      } else {
        // Crear rol
        this.roleService.createRole(roleData).subscribe({
          next: () => {
            this.loading = false;
            this.snackBar.open('Rol creado correctamente', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error al crear rol:', error);
            this.loading = false;
            this.snackBar.open('Error al crear rol', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
} 