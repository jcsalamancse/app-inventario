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
import { FormsModule } from '@angular/forms';
import { AuthService, Role } from '../../../../services/auth.service';
import { RoleFormComponent } from '../role-form/role-form.component';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule,
    MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatCardModule,
    MatProgressSpinnerModule, MatFormFieldModule
  ],
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RolesListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource: Role[] = [];
  loading = false;
  filter = { search: '' };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Role>;

  constructor(private authService: AuthService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.loading = true;
    this.authService.getRoles().subscribe({
      next: (roles: Role[]) => {
        // Filtrado local
        let filtered = roles;
        if (this.filter.search) {
          const search = this.filter.search.toLowerCase();
          filtered = filtered.filter(r => r.name.toLowerCase().includes(search));
        }
        this.dataSource = filtered;
        this.loading = false;
      },
      error: () => { this.dataSource = []; this.loading = false; }
    });
  }

  applyFilter() {
    this.loadRoles();
  }

  openRoleDialog(role?: Role) {
    const dialogRef = this.dialog.open(RoleFormComponent, {
      width: '500px',
      data: role || null
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRoles();
        this.snackBar.open(role ? 'Rol actualizado' : 'Rol creado', 'Cerrar', { duration: 3000 });
      }
    });
  }

  deleteRole(role: Role) {
    const confirmed = confirm(`¿Seguro que deseas eliminar el rol "${role.name}"?`);
    if (confirmed) {
      this.authService.deleteRole(role.id).subscribe({
        next: () => {
          this.loadRoles();
          this.snackBar.open('Rol eliminado', 'Cerrar', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Error al eliminar rol', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
} 