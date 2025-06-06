import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-roles-list',
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
        <h1 class="text-2xl font-bold text-gray-800">Gestión de Roles</h1>
        <button mat-raised-button color="primary" (click)="openRoleDialog()">
          <mat-icon>add</mat-icon>
          Nuevo Rol
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

              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
                <td mat-cell *matCellDef="let row">{{row.name}}</td>
              </ng-container>

              <!-- Code Column -->
              <ng-container matColumnDef="code">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Código</th>
                <td mat-cell *matCellDef="let row">{{row.code}}</td>
              </ng-container>

              <!-- Description Column -->
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Descripción</th>
                <td mat-cell *matCellDef="let row">{{row.description}}</td>
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
                  <button mat-icon-button [matTooltip]="'Editar'" (click)="editRole(row)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button [matTooltip]="'Eliminar'" (click)="deleteRole(row)">
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

          <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Seleccionar página de roles"></mat-paginator>
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
export class RolesListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'code', 'description', 'isActive', 'actions'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {}

  ngOnInit(): void {
    // TODO: Implementar carga de datos
  }

  applyFilter(event: Event): void {
    // TODO: Implementar filtrado
  }

  openRoleDialog(): void {
    // TODO: Implementar diálogo de nuevo rol
  }

  editRole(role: any): void {
    // TODO: Implementar edición
  }

  deleteRole(role: any): void {
    // TODO: Implementar eliminación
  }
} 