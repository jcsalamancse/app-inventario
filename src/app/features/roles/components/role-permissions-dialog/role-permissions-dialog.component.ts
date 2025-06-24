import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { PermissionService } from '../../../permissions/services/permission.service';
import { RoleService } from '../../../users/services/role.service';
import { Permission } from '../../../permissions/models/permission.model';
import { ConfirmDialogComponent, ConfirmDialogConfig } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-role-permissions-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSnackBarModule, MatProgressSpinnerModule, FormsModule
  ],
  template: `
    <div class="relative w-full max-w-full sm:max-w-xl md:max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
      <!-- Encabezado sticky -->
      <div class="flex justify-between items-center px-6 py-4 border-b bg-gray-50 sticky top-0 z-20">
        <h2 class="text-2xl font-bold">Permisos del Rol: {{data.roleName}}</h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Búsqueda sticky -->
      <div class="px-6 py-2 bg-gray-50 sticky top-16 z-10">
        <mat-form-field class="w-full m-0">
          <mat-label>Buscar permisos</mat-label>
          <input matInput [(ngModel)]="search" (ngModelChange)="filterPermissions()">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <!-- Tabla de permisos -->
      <div class="overflow-y-auto max-h-[60vh] overflow-x-auto">
        <table class="w-full min-w-[700px] table-auto">
          <thead>
            <tr class="bg-gray-100 text-gray-700 border-b">
              <th class="px-3 py-2 w-20 text-left">Asignado</th>
              <th class="px-3 py-2 text-left max-w-[120px]">Nombre</th>
              <th class="px-3 py-2 text-left max-w-[120px]">Código</th>
              <th class="px-3 py-2 text-left max-w-[100px]">Módulo</th>
              <th class="px-3 py-2 text-left max-w-[180px]">Descripción</th>
            </tr>
          </thead>
          <tbody>
            <ng-container *ngFor="let group of groupedPermissions">
              <tr class="bg-blue-50 border-b">
                <td colspan="5" class="font-semibold px-3 py-2 text-blue-700">{{ group.module }}</td>
              </tr>
              <tr *ngFor="let p of group.permissions; let i = index" [class.bg-gray-50]="i % 2 === 0" class="border-b">
                <td class="px-3 py-2 text-center">
                  <input type="checkbox" [checked]="isAssigned(p.id)" (change)="togglePermission(p.id, $event)">
                </td>
                <td class="px-3 py-2 whitespace-normal break-words max-w-[120px]">{{p.name}}</td>
                <td class="px-3 py-2 whitespace-normal break-words max-w-[120px]">{{p.code}}</td>
                <td class="px-3 py-2 whitespace-normal break-words max-w-[100px]">{{p.module}}</td>
                <td class="px-3 py-2 whitespace-normal break-words max-w-[180px]">{{p.description}}</td>
              </tr>
            </ng-container>
          </tbody>
        </table>
        <div *ngIf="filteredPermissions.length === 0" class="text-center text-gray-400 py-8">
          No hay permisos para mostrar.
        </div>
      </div>

      <!-- Barra de acciones sticky abajo -->
      <div class="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50 sticky bottom-0 z-20">
        <button mat-button (click)="close()">Cancelar</button>
        <button mat-raised-button color="primary" [disabled]="!hasChanges || saving" (click)="savePermissions()">
          <mat-spinner *ngIf="saving" diameter="20" class="mr-2"></mat-spinner>
          Guardar Cambios
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-width: 600px;
      max-width: 800px;
    }
  `]
})
export class RolePermissionsDialogComponent implements OnInit {
  allPermissions: Permission[] = [];
  assignedPermissions: number[] = [];
  filteredPermissions: Permission[] = [];
  search = '';
  loading = false;
  saving = false;
  hasChanges = false;
  pendingChanges: { add: number[], remove: number[] } = { add: [], remove: [] };
  private originalAssigned: number[] = [];

  get groupedPermissions() {
    const groups: { module: string, permissions: Permission[] }[] = [];
    const map = new Map<string, Permission[]>();
    for (const p of this.filteredPermissions) {
      const mod = p.module || 'Sin módulo';
      if (!map.has(mod)) map.set(mod, []);
      map.get(mod)!.push(p);
    }
    for (const [module, permissions] of map.entries()) {
      groups.push({ module, permissions });
    }
    return groups;
  }

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
      next: (all: Permission[]) => {
        this.allPermissions = all;
        this.permissionService.getPermissionsByRole(this.data.roleId).subscribe({
          next: (assigned: Permission[]) => {
            this.assignedPermissions = assigned.map(p => p.id);
            this.originalAssigned = [...this.assignedPermissions];
            this.filteredPermissions = this.allPermissions;
            this.loading = false;
          },
          error: () => {
            this.assignedPermissions = [];
            this.originalAssigned = [];
            this.filteredPermissions = this.allPermissions;
            this.loading = false;
          }
        });
      },
      error: () => {
        this.allPermissions = [];
        this.filteredPermissions = [];
        this.loading = false;
      }
    });
  }

  filterPermissions() {
    const term = this.search.trim().toLowerCase();
    if (!term) {
      this.filteredPermissions = this.allPermissions;
      return;
    }
    this.filteredPermissions = this.allPermissions.filter(p =>
      p.name.toLowerCase().includes(term) ||
      (p.code?.toLowerCase().includes(term) ?? false) ||
      (p.description?.toLowerCase().includes(term) ?? false) ||
      (p.module?.toLowerCase().includes(term) ?? false)
    );
  }

  isAssigned(permissionId: number): boolean {
    return this.assignedPermissions.includes(permissionId);
  }

  togglePermission(permissionId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.assignedPermissions.includes(permissionId)) {
        this.assignedPermissions.push(permissionId);
      }
    } else {
      this.assignedPermissions = this.assignedPermissions.filter(id => id !== permissionId);
    }
    this.updatePendingChanges();
  }

  updatePendingChanges() {
    const add = this.assignedPermissions.filter(id => !this.originalAssigned.includes(id));
    const remove = this.originalAssigned.filter(id => !this.assignedPermissions.includes(id));
    this.pendingChanges = { add, remove };
    this.hasChanges = add.length > 0 || remove.length > 0;
  }

  savePermissions() {
    if (!this.hasChanges) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Guardar cambios',
        message: '¿Deseas guardar los cambios en los permisos?',
        confirmText: 'Guardar',
        cancelText: 'Cancelar',
        icon: 'save',
        iconColor: 'text-blue-500'
      } as ConfirmDialogConfig
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.saving = true;
        const addPromise = this.pendingChanges.add.length > 0
          ? this.permissionService.assignPermissionsToRole(this.data.roleId, this.pendingChanges.add).toPromise()
          : Promise.resolve();
        const removePromise = this.pendingChanges.remove.length > 0
          ? this.permissionService.removePermissionsFromRole(this.data.roleId, this.pendingChanges.remove).toPromise()
          : Promise.resolve();
        Promise.all([addPromise, removePromise])
          .then(() => {
            this.snackBar.open('Permisos actualizados correctamente', 'Cerrar', { duration: 2000 });
            this.dialogRef.close(true);
          })
          .catch(() => {
            this.snackBar.open('Error al actualizar permisos', 'Cerrar', { duration: 2000 });
            this.saving = false;
          });
      }
    });
  }

  close() {
    if (this.hasChanges) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: {
          title: 'Salir sin guardar',
          message: '¿Deseas salir sin guardar los cambios?',
          confirmText: 'Salir',
          cancelText: 'Cancelar',
          icon: 'warning',
          iconColor: 'text-yellow-500'
        } as ConfirmDialogConfig
      });
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }
} 