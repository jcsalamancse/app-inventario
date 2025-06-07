import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { RoleService, Role } from '../../../users/services/role.service';
import { RoleFormComponent } from '../role-form/role-form.component';
import { RolePermissionsDialogComponent } from '../role-permissions-dialog/role-permissions-dialog.component';
import { map } from 'rxjs/operators';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule,
    MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatCardModule,
    MatProgressSpinnerModule, MatFormFieldModule, MatChipsModule, MatTooltipModule
  ],
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'code', 'description', 'isActive', 'isDefault', 'permissions', 'actions'];
  dataSource: Role[] = [];
  loading = false;
  filter = { search: '' };
  permissionsMap: { [roleId: number]: string[] } = {};
  loadingPermissions: { [roleId: number]: boolean } = {};
  settingDefault: { [roleId: number]: boolean } = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Role>;

  constructor(
    private roleService: RoleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.loading = true;
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => {
        let filtered = roles;
        if (this.filter.search) {
          const search = this.filter.search.toLowerCase();
          filtered = filtered.filter(r => 
            r.name.toLowerCase().includes(search) ||
            r.code.toLowerCase().includes(search) ||
            (r.description?.toLowerCase().includes(search) ?? false)
          );
        }
        this.dataSource = filtered;
        this.loading = false;
        // Cargar permisos para cada rol
        this.dataSource.forEach(role => this.loadPermissions(role.id));
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        this.snackBar.open('Error al cargar roles', 'Cerrar', { duration: 3000 });
        this.dataSource = [];
        this.loading = false;
      }
    });
  }

  applyFilter() {
    this.loadRoles();
  }

  openRoleDialog(role?: Role) {
    const dialogRef = this.dialog.open(RoleFormComponent, {
      width: '600px',
      data: role || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRoles();
        this.snackBar.open(
          role ? 'Rol actualizado correctamente' : 'Rol creado correctamente',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }

  deleteRole(role: Role) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Eliminar rol',
        message: `¿Seguro que deseas eliminar el rol "${role.name}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        icon: 'delete',
        iconColor: 'text-red-500'
      } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.roleService.deleteRole(role.id).subscribe({
          next: () => {
            this.loadRoles();
            this.snackBar.open('Rol eliminado correctamente', 'Cerrar', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error al eliminar rol:', error);
            this.snackBar.open('Error al eliminar rol', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  toggleRoleStatus(role: Role) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: role.isActive ? 'Inactivar rol' : 'Activar rol',
        message: role.isActive
          ? `¿Deseas inactivar el rol "${role.name}"? Los usuarios perderán acceso inmediato.`
          : `¿Deseas activar el rol "${role.name}"? Los usuarios podrán usarlo de inmediato.`,
        confirmText: role.isActive ? 'Inactivar' : 'Activar',
        cancelText: 'Cancelar',
        icon: role.isActive ? 'block' : 'check_circle',
        iconColor: role.isActive ? 'bg-yellow-100 text-yellow-500' : 'bg-green-100 text-green-500'
      } as ConfirmDialogData
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      const updatedRole = {
        ...role,
        id: role.id, // asegurar que id esté presente
        isActive: !role.isActive
      };
      this.roleService.updateRole(role.id, updatedRole).pipe(
        map((r: any) => ({
          id: r.Id,
          name: r.Name,
          code: r.Code,
          description: r.Description,
          isActive: r.IsActive,
          isDefault: r.IsDefault,
          createdAt: r.CreatedAt,
          updatedAt: r.UpdatedAt,
          permissions: r.Permissions?.$values ?? []
        }))
      ).subscribe({
        next: (mappedRole) => {
          const index = this.dataSource.findIndex(r => r.id === role.id);
          if (index !== -1) {
            this.dataSource[index] = mappedRole;
            this.table.renderRows();
          }
          this.snackBar.open(
            `Rol ${mappedRole.isActive ? 'activado' : 'inactivado'} correctamente`,
            'Cerrar',
            { duration: 3000 }
          );
        },
        error: (error) => {
          console.error('Error al actualizar estado del rol:', error);
          this.snackBar.open('Error al actualizar estado del rol', 'Cerrar', { duration: 3000 });
        }
      });
    });
  }

  // Permisos
  loadPermissions(roleId: number) {
    this.loadingPermissions[roleId] = true;
    this.roleService.getRolePermissions(roleId).subscribe({
      next: (permissions) => {
        this.permissionsMap[roleId] = permissions;
        this.loadingPermissions[roleId] = false;
      },
      error: (error) => {
        this.permissionsMap[roleId] = [];
        this.loadingPermissions[roleId] = false;
        console.error('Error al cargar permisos:', error);
      }
    });
  }

  addPermission(roleId: number, permissionId: number) {
    this.roleService.addRolePermission(roleId, permissionId).subscribe({
      next: () => {
        this.loadPermissions(roleId);
        this.snackBar.open('Permiso agregado', 'Cerrar', { duration: 2000 });
      },
      error: (error) => {
        console.error('Error al agregar permiso:', error);
        this.snackBar.open('Error al agregar permiso', 'Cerrar', { duration: 2000 });
      }
    });
  }

  removePermission(roleId: number, permissionId: number) {
    this.roleService.removeRolePermission(roleId, permissionId).subscribe({
      next: () => {
        this.loadPermissions(roleId);
        this.snackBar.open('Permiso eliminado', 'Cerrar', { duration: 2000 });
      },
      error: (error) => {
        console.error('Error al eliminar permiso:', error);
        this.snackBar.open('Error al eliminar permiso', 'Cerrar', { duration: 2000 });
      }
    });
  }

  // Establecer como rol por defecto
  setDefaultRole(role: Role) {
    this.settingDefault[role.id] = true;
    this.roleService.setDefaultRole(role.id).subscribe({
      next: (updatedRole) => {
        this.settingDefault[role.id] = false;
        this.loadRoles();
        this.snackBar.open('Rol establecido como predeterminado', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        this.settingDefault[role.id] = false;
        console.error('Error al establecer rol por defecto:', error);
        this.snackBar.open('Error al establecer rol por defecto', 'Cerrar', { duration: 3000 });
      }
    });
  }

  openPermissionsDialog(role: Role) {
    this.dialog.open(RolePermissionsDialogComponent, {
      width: '700px',
      data: { roleId: role.id, roleName: role.name }
    });
  }
} 