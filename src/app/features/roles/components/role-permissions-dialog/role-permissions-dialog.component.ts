import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { PermissionService } from '../../../users/services/permission.service';
import { RoleService } from '../../../users/services/role.service';
import { Permission } from '../../../users/models/permission.model';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-role-permissions-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatListModule, MatSnackBarModule, MatProgressSpinnerModule, FormsModule
  ],
  templateUrl: './role-permissions-dialog.component.html',
  styleUrls: ['./role-permissions-dialog.component.scss']
})
export class RolePermissionsDialogComponent implements OnInit {
  allPermissions: Permission[] = [];
  assignedPermissions: Permission[] = [];
  availablePermissions: Permission[] = [];
  search = '';
  loading = false;
  adding = false;
  removing = false;

  constructor(
    public dialogRef: MatDialogRef<RolePermissionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { roleId: number; roleName: string },
    private permissionService: PermissionService,
    private roleService: RoleService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadPermissions();
  }

  loadPermissions() {
    this.loading = true;
    this.permissionService.getPermissions().subscribe({
      next: (all) => {
        this.allPermissions = all;
        this.roleService.getRolePermissions(this.data.roleId).subscribe({
          next: (assigned) => {
            this.assignedPermissions = all.filter(p => assigned.some((ap: any) => ap.id === p.id));
            this.updateAvailablePermissions();
            this.loading = false;
          },
          error: () => {
            this.assignedPermissions = [];
            this.updateAvailablePermissions();
            this.loading = false;
          }
        });
      },
      error: () => {
        this.allPermissions = [];
        this.loading = false;
      }
    });
  }

  updateAvailablePermissions() {
    this.availablePermissions = this.allPermissions.filter(
      p => !this.assignedPermissions.some(ap => ap.id === p.id)
    );
  }

  filterPermissions(list: Permission[]): Permission[] {
    const term = this.search.trim().toLowerCase();
    if (!term) return list;
    return list.filter(p =>
      p.name.toLowerCase().includes(term) ||
      (p.code?.toLowerCase().includes(term) ?? false)
    );
  }

  addPermission(permission: Permission) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Agregar permiso',
        message: `¿Deseas agregar el permiso "${permission.name}" al rol?`,
        confirmText: 'Agregar',
        cancelText: 'Cancelar',
        icon: 'add_circle',
        iconColor: 'text-green-500'
      } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.adding = true;
        this.roleService.addRolePermission(this.data.roleId, permission.id).subscribe({
          next: () => {
            this.snackBar.open('Permiso agregado', 'Cerrar', { duration: 2000 });
            this.loadPermissions();
            this.adding = false;
          },
          error: () => {
            this.snackBar.open('Error al agregar permiso', 'Cerrar', { duration: 2000 });
            this.adding = false;
          }
        });
      }
    });
  }

  removePermission(permission: Permission) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Quitar permiso',
        message: `¿Deseas quitar el permiso "${permission.name}" del rol?`,
        confirmText: 'Quitar',
        cancelText: 'Cancelar',
        icon: 'remove_circle',
        iconColor: 'text-red-500'
      } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.removing = true;
        this.roleService.removeRolePermission(this.data.roleId, permission.id).subscribe({
          next: () => {
            this.snackBar.open('Permiso eliminado', 'Cerrar', { duration: 2000 });
            this.loadPermissions();
            this.removing = false;
          },
          error: () => {
            this.snackBar.open('Error al eliminar permiso', 'Cerrar', { duration: 2000 });
            this.removing = false;
          }
        });
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
} 