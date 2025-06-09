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
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-role-permissions-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSnackBarModule, MatProgressSpinnerModule, FormsModule
  ],
  template: `
    <div class="p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Permisos del Rol: {{data.roleName}}</h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div *ngIf="loading" class="flex justify-center p-4">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading" class="space-y-4">
        <div class="flex justify-between items-center">
          <mat-form-field class="w-full">
            <mat-label>Buscar permisos</mat-label>
            <input matInput [(ngModel)]="search" (ngModelChange)="filterPermissions()">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>
        <div class="max-h-96 overflow-y-auto border rounded bg-white">
          <table class="min-w-full">
            <thead>
              <tr>
                <th class="px-4 py-2">Asignado</th>
                <th class="px-4 py-2">Nombre</th>
                <th class="px-4 py-2">Código</th>
                <th class="px-4 py-2">Módulo</th>
                <th class="px-4 py-2">Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of filteredPermissions">
                <td class="px-4 py-2 text-center">
                  <input type="checkbox" [checked]="isAssigned(p.id)" (change)="togglePermission(p.id, $event)">
                </td>
                <td class="px-4 py-2">{{p.name}}</td>
                <td class="px-4 py-2">{{p.code}}</td>
                <td class="px-4 py-2">{{p.module}}</td>
                <td class="px-4 py-2">{{p.description}}</td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="filteredPermissions.length === 0" class="text-center text-gray-400 py-8">
            No hay permisos para mostrar.
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-4">
          <button mat-button (click)="close()">Cancelar</button>
          <button mat-raised-button color="primary" 
                  [disabled]="!hasChanges || saving"
                  (click)="savePermissions()">
            <mat-spinner *ngIf="saving" diameter="20" class="mr-2"></mat-spinner>
            Guardar Cambios
          </button>
        </div>
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
      } as ConfirmDialogData
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
        } as ConfirmDialogData
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