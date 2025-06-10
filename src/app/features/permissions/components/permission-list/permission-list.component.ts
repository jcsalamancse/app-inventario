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
    MatFormFieldModule
  ],
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss']
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