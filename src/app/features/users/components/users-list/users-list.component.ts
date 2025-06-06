import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCardModule,
    MatTooltipModule,
    MatChipsModule,
    MatCheckboxModule
  ],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <button mat-raised-button color="primary" (click)="openUserDialog()">
          <mat-icon>add</mat-icon>
          Nuevo Usuario
        </button>
      </div>

      <mat-card class="mb-6">
        <mat-card-content>
          <div class="flex justify-between items-center mb-4">
            <mat-form-field class="w-1/3">
              <mat-label>Filtrar</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Buscar..." #input>
            </mat-form-field>
          </div>

          <div class="overflow-x-auto">
            <table mat-table [dataSource]="dataSource" matSort>
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let row">{{row.id}}</td>
              </ng-container>

              <!-- Username Column -->
              <ng-container matColumnDef="username">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Usuario</th>
                <td mat-cell *matCellDef="let row">{{row.username}}</td>
              </ng-container>

              <!-- Email Column -->
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
                <td mat-cell *matCellDef="let row">{{row.email}}</td>
              </ng-container>

              <!-- Role Column -->
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Rol</th>
                <td mat-cell *matCellDef="let row">{{row.role}}</td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="isActive">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th>
                <td mat-cell *matCellDef="let row">
                  <mat-chip-listbox>
                    <mat-chip [color]="row.isActive ? 'primary' : 'warn'" selected>
                      {{row.isActive ? 'Activo' : 'Inactivo'}}
                    </mat-chip>
                  </mat-chip-listbox>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let row">
                  <button mat-icon-button [matTooltip]="'Editar'" (click)="editUser(row)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button [matTooltip]="'Eliminar'" (click)="deleteUser(row)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

              <!-- Row shown when there is no matching data. -->
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell" colspan="6">No hay datos que coincidan con el filtro "{{input.value}}"</td>
              </tr>
            </table>
          </div>

          <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Seleccionar página de usuarios"></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class UsersListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'email', 'role', 'isActive', 'actions'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource = users;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => console.error('Error al cargar usuarios', error)
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: user
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  editUser(user: User): void {
    this.openUserDialog(user);
  }

  deleteUser(user: User): void {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => console.error('Error al eliminar usuario', error)
      });
    }
  }
} 