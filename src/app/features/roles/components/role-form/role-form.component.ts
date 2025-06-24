import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { RoleService, Role } from '../../../users/services/role.service';
import { PermissionService } from '../../../users/services/permission.service';
import { Permission } from '../../../users/models/permission.model';
import { ConfirmDialogComponent, ConfirmDialogConfig } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatSnackBarModule, MatCheckboxModule, MatProgressSpinnerModule, 
    MatSelectModule, MatChipsModule
  ],
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  permissions: Permission[] = [];
  selectedPermissions: Permission[] = [];
  searchTerm = '';

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
    this.initializeForm();
    this.loadPermissions();
  }

  private initializeForm() {
    this.form = this.fb.group({
      name: [this.data?.name || '', [Validators.required, Validators.minLength(3)]],
      code: [this.data?.code || '', [Validators.required]],
      description: [this.data?.description || ''],
      isActive: [this.data?.isActive ?? true],
      isDefault: [this.data?.isDefault ?? false]
    });
  }

  private loadPermissions() {
    this.loading = true;
    this.permissionService.getPermissions()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (permissions) => {
          this.permissions = permissions;
          if (this.data && this.data.permissions) {
            this.selectedPermissions = permissions.filter(p => 
              this.data!.permissions?.includes(p.code || '')
            );
          }
        },
        error: (error) => {
          console.error('Error al cargar permisos:', error);
          this.snackBar.open('Error al cargar permisos', 'Cerrar', { duration: 3000 });
        }
      });
  }

  get filteredPermissions(): Permission[] {
    return this.permissions.filter(p => 
      !this.selectedPermissions.some(sp => sp.id === p.id) &&
      (p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       p.code?.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  addPermission(permission: Permission) {
    this.selectedPermissions = [...this.selectedPermissions, permission];
  }

  removePermission(permission: Permission) {
    this.selectedPermissions = this.selectedPermissions.filter(p => p.id !== permission.id);
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
      } as ConfirmDialogConfig
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      
      this.loading = true;
      const roleData = {
        ...this.form.value,
        permissions: this.selectedPermissions.map(p => p.code)
      };

      const request$ = this.data
        ? this.roleService.updateRole(this.data.id, roleData)
        : this.roleService.createRole(roleData);

      request$.pipe(finalize(() => this.loading = false))
        .subscribe({
          next: () => {
            this.snackBar.open(
              `Rol ${this.data ? 'actualizado' : 'creado'} correctamente`,
              'Cerrar',
              { duration: 3000 }
            );
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error(`Error al ${this.data ? 'actualizar' : 'crear'} rol:`, error);
            this.snackBar.open(
              `Error al ${this.data ? 'actualizar' : 'crear'} rol`,
              'Cerrar',
              { duration: 3000 }
            );
          }
        });
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