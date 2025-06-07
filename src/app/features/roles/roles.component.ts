import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, Role } from '../../services/auth.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Gestión de Roles</h2>
      <button mat-raised-button color="primary" (click)="openAddRoleDialog()">
        <mat-icon>add</mat-icon> Agregar Rol
      </button>
      <table mat-table [dataSource]="roles" class="mt-4 w-full">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let role">{{ role.id }}</td>
        </ng-container>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nombre</th>
          <td mat-cell *matCellDef="let role">{{ role.name }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: []
})
export class RolesComponent implements OnInit {
  roles: Role[] = [];
  displayedColumns: string[] = ['id', 'name'];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.authService.getRoles().subscribe(
      (data) => {
        this.roles = data;
      },
      (error) => {
        console.error('Error al cargar roles', error);
      }
    );
  }

  openAddRoleDialog(): void {
    // Implementar lógica para abrir un diálogo de agregar rol
  }
} 