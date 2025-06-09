import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PermissionService } from '../../services/permission.service';
import { Permission } from '../../models/permission.model';
import { PermissionFormComponent } from '../permission-form/permission-form.component';

@Component({
  selector: 'app-permission-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    PermissionFormComponent
  ],
  template: `
    <div class="p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Gestión de Permisos</h2>
        <button mat-raised-button color="primary" (click)="openPermissionForm()">
          <mat-icon>add</mat-icon>
          Nuevo Permiso
        </button>
      </div>

      <div class="mb-4">
        <mat-form-field class="w-full">
          <mat-label>Buscar permisos</mat-label>
          <input matInput [(ngModel)]="search" (ngModelChange)="filterPermissions()">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <div *ngIf="loading" class="flex justify-center p-4">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading">
        <table class="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th class="px-4 py-2">ID</th>
              <th class="px-4 py-2">Nombre</th>
              <th class="px-4 py-2">Código</th>
              <th class="px-4 py-2">Módulo</th>
              <th class="px-4 py-2">Descripción</th>
              <th class="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of filtered">
              <td class="px-4 py-2">{{p.id}}</td>
              <td class="px-4 py-2">{{p.name}}</td>
              <td class="px-4 py-2">{{p.code}}</td>
              <td class="px-4 py-2">{{p.module}}</td>
              <td class="px-4 py-2">{{p.description}}</td>
              <td class="px-4 py-2 flex gap-2">
                <button mat-icon-button color="primary" (click)="openPermissionForm(p)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deletePermission(p)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="filtered.length === 0" class="text-center text-gray-400 py-8">
          No hay permisos para mostrar.
        </div>
      </div>
    </div>
  `
})
export class PermissionListComponent implements OnInit {
  permissions: Permission[] = [];
  filtered: Permission[] = [];
  loading = false;
  search = '';

  constructor(
    private permissionService: PermissionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadPermissions();
  }

  loadPermissions() {
    this.loading = true;
    this.permissionService.getPermissions().subscribe({
      next: (perms) => {
        this.permissions = perms;
        this.filtered = perms;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar permisos', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  filterPermissions() {
    const term = this.search.trim().toLowerCase();
    if (!term) {
      this.filtered = this.permissions;
      return;
    }
    this.filtered = this.permissions.filter(p =>
      p.name.toLowerCase().includes(term) ||
      (p.code?.toLowerCase().includes(term) ?? false) ||
      (p.description?.toLowerCase().includes(term) ?? false) ||
      (p.module?.toLowerCase().includes(term) ?? false)
    );
  }

  openPermissionForm(permission?: Permission) {
    const dialogRef = this.dialog.open(PermissionFormComponent, {
      width: '500px',
      data: permission
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPermissions();
      }
    });
  }

  deletePermission(permission: Permission) {
    if (confirm(`¿Seguro que deseas eliminar el permiso "${permission.name}"?`)) {
      this.permissionService.deletePermission(permission.id).subscribe({
        next: () => {
          this.snackBar.open('Permiso eliminado', 'Cerrar', { duration: 2000 });
          this.loadPermissions();
        },
        error: () => {
          this.snackBar.open('Error al eliminar permiso', 'Cerrar', { duration: 2000 });
        }
      });
    }
  }
} 