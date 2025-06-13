import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovementService } from '../services/movement.service';
import { Movement } from '../models/movement.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MovementFormComponent } from './movement-form.component';

@Component({
  selector: 'app-movement-list',
  standalone: true,
  imports: [CommonModule, MovementFormComponent],
  template: `
    <div class="p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-gray-800">Movimientos</h2>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" (click)="onAdd()">
          <span class="font-semibold">+ Nuevo Movimiento</span>
        </button>
      </div>
      <div *ngIf="loading" class="flex justify-center items-center py-8">
        <span class="loader border-4 border-blue-500 border-t-transparent rounded-full w-10 h-10 animate-spin"></span>
      </div>
      <div *ngIf="error" class="text-red-500 mb-4">{{ error }}</div>
      <div *ngIf="!loading && !error">
        <table class="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead class="bg-blue-50">
            <tr>
              <th class="px-4 py-2 text-left">ID</th>
              <th class="px-4 py-2 text-left">Tipo</th>
              <th class="px-4 py-2 text-left">Estado</th>
              <th class="px-4 py-2 text-left">Fecha</th>
              <th class="px-4 py-2 text-left">Total</th>
              <th class="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let movement of movements">
              <td class="px-4 py-2">{{ movement.id }}</td>
              <td class="px-4 py-2">{{ movement.type }}</td>
              <td class="px-4 py-2">
                <span [ngClass]="{
                  'text-yellow-600': movement.status === 'pendiente',
                  'text-green-600': movement.status === 'aprobado' || movement.status === 'completado',
                  'text-red-600': movement.status === 'rechazado' || movement.status === 'cancelado'
                }">
                  {{ movement.status | titlecase }}
                </span>
              </td>
              <td class="px-4 py-2">{{ movement.date | date:'short' }}</td>
              <td class="px-4 py-2">{{ movement.total | currency:'USD' }}</td>
              <td class="px-4 py-2 flex gap-2">
                <button class="text-blue-600 hover:underline" (click)="onView(movement)">Ver</button>
                <button class="text-green-600 hover:underline" (click)="onEdit(movement)">Editar</button>
                <button class="text-red-600 hover:underline" (click)="onDelete(movement)">Eliminar</button>
              </td>
            </tr>
            <tr *ngIf="movements.length === 0">
              <td colspan="6" class="text-gray-500 text-center py-8">
                No hay movimientos registrados. Haz clic en <span class='font-semibold text-blue-600'>"+ Nuevo Movimiento"</span> para agregar uno.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Diálogo de confirmación para eliminar -->
      <div *ngIf="showDeleteConfirm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div class="bg-white rounded-xl p-8 shadow-xl w-full max-w-sm">
          <h3 class="text-lg font-bold mb-4 text-gray-800">¿Eliminar movimiento?</h3>
          <p class="mb-6 text-gray-600">Esta acción no se puede deshacer.</p>
          <div class="flex justify-end gap-3">
            <button class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300" (click)="showDeleteConfirm = false">Cancelar</button>
            <button class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600" (click)="confirmDelete()">Eliminar</button>
          </div>
        </div>
      </div>

      <app-movement-form *ngIf="showForm" (saved)="onFormSaved()" (cancelled)="onFormCancelled()" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50" />
    </div>
  `,
  styles: [`
    .loader {
      border-top-color: transparent;
      border-radius: 50%;
      width: 2.5rem;
      height: 2.5rem;
      border-width: 4px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class MovementListComponent implements OnInit {
  movements: Movement[] = [];
  loading = false;
  error: string | null = null;
  showDeleteConfirm = false;
  movementToDelete: Movement | null = null;
  showForm = false;

  constructor(private movementService: MovementService, private router: Router) {}

  ngOnInit() {
    this.fetchMovements();
  }

  fetchMovements() {
    this.loading = true;
    this.error = null;
    this.movementService.getAll().subscribe({
      next: (data) => {
        this.movements = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar la información de movimientos.';
        this.loading = false;
        // Redirige SIEMPRE tras mostrar el mensaje, para máxima resiliencia UX
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      }
    });
  }

  onView(movement: Movement) {
    // Aquí puedes abrir un modal o navegar a un detalle
    alert('Ver movimiento: ' + movement.id);
  }

  onEdit(movement: Movement) {
    // Aquí puedes abrir un formulario de edición o navegar a la vista de edición
    alert('Editar movimiento: ' + movement.id);
  }

  onDelete(movement: Movement) {
    this.movementToDelete = movement;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (!this.movementToDelete) return;
    this.loading = true;
    this.movementService.delete(this.movementToDelete.id).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.movementToDelete = null;
        this.fetchMovements();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al eliminar el movimiento';
        this.loading = false;
        this.showDeleteConfirm = false;
        this.movementToDelete = null;
      }
    });
  }

  onAdd() {
    this.showForm = true;
  }

  onFormSaved() {
    this.showForm = false;
    this.fetchMovements();
  }

  onFormCancelled() {
    this.showForm = false;
  }
} 