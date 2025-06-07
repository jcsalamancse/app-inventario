import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatDialogModule,
    MatTooltipModule
  ],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="openUserDialog()"
          class="flex items-center gap-2">
          <mat-icon>add</mat-icon>
          <span>Nuevo Usuario</span>
        </button>
      </div>

      <div class="mb-4">
        <mat-form-field class="w-full">
          <mat-label>Buscar usuarios</mat-label>
          <input 
            matInput 
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Buscar por nombre, email...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table mat-table [dataSource]="users" class="w-full">
          <!-- ID Column -->
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let user">{{user.Id}}</td>
          </ng-container>

          <!-- Username Column -->
          <ng-container matColumnDef="username">
            <th mat-header-cell *matHeaderCellDef>Usuario</th>
            <td mat-cell *matCellDef="let user">{{user.UserName}}</td>
          </ng-container>

          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let user">{{user.FirstName}} {{user.LastName}}</td>
          </ng-container>

          <!-- Email Column -->
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let user">{{user.Email}}</td>
          </ng-container>

          <!-- Role Column -->
          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Rol</th>
            <td mat-cell *matCellDef="let user">{{user.RoleId}}</td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let user">
              <span 
                [class]="user.IsActive ? 'text-green-600' : 'text-red-600'"
                class="px-2 py-1 rounded-full text-sm">
                {{user.IsActive ? 'Activo' : 'Inactivo'}}
              </span>
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let user">
              <div class="flex gap-2">
                <button 
                  mat-icon-button 
                  color="primary"
                  (click)="openUserDialog(user)"
                  matTooltip="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button 
                  mat-icon-button 
                  color="warn"
                  (click)="toggleUserStatus(user)"
                  matTooltip="{{user.IsActive ? 'Desactivar' : 'Activar'}}">
                  <mat-icon>{{user.IsActive ? 'block' : 'check_circle'}}</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator
          [length]="totalItems"
          [pageSize]="pageSize"
          [pageSizeOptions]="[5, 10, 25, 100]"
          (page)="onPageChange($event)"
          aria-label="Seleccionar página">
        </mat-paginator>
      </div>
    </div>
  `,
  styles: []
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'username', 'name', 'email', 'role', 'status', 'actions'];
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(term => {
        this.currentPage = 1;
        this.loadUsers();
      });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers()
      .subscribe({
        next: (users: User[]) => {
          // Filtro local mejorado: insensible a mayúsculas/minúsculas y espacios
          const term = this.searchTerm.trim().toLowerCase();
          let filtered = users;
          if (term) {
            filtered = users.filter(u => {
              const fullName = `${u.FirstName || ''} ${u.LastName || ''}`.toLowerCase();
              return (
                (u.FirstName && u.FirstName.toLowerCase().includes(term)) ||
                (u.LastName && u.LastName.toLowerCase().includes(term)) ||
                (u.Email && u.Email.toLowerCase().includes(term)) ||
                (u.UserName && u.UserName.toLowerCase().includes(term)) ||
                fullName.includes(term)
              );
            });
          }
          this.users = filtered;
          this.totalItems = filtered.length;
        },
        error: (error: any) => {
          this.snackBar.open('Error al cargar usuarios', 'Cerrar', {
            duration: 3000
          });
          console.error('Error loading users:', error);
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  openUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  toggleUserStatus(user: User): void {
    this.userService.deleteUser(user.Id).subscribe({
      next: () => {
        this.loadUsers();
        this.snackBar.open(
          `Usuario eliminado exitosamente`,
          'Cerrar',
          { duration: 3000 }
        );
      },
      error: (error: any) => {
        this.snackBar.open('Error al eliminar usuario', 'Cerrar', {
          duration: 3000
        });
        console.error('Error eliminando usuario:', error);
      }
    });
  }
} 