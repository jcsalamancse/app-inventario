import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovementService } from '../services/movement.service';
import { Movement, MovementFormData } from '../models/movement.model';
import { BehaviorSubject, catchError, finalize, of } from 'rxjs';
import { MovementFormComponent } from './movement-form.component';
import { ConfirmDialogComponent } from '../../../shared/components';

@Component({
  selector: 'app-movement-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MovementFormComponent, ConfirmDialogComponent],
  template: `
    <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <!-- Encabezado -->
      <div class="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Gestión de Movimientos</h2>
          <p class="mt-1 text-sm text-gray-500">
            Administre los movimientos de inventario del sistema
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <button 
            (click)="openForm()"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Movimiento
          </button>
        </div>
      </div>

      <!-- Filtros -->
      <div class="mb-6">
        <div class="relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            [(ngModel)]="filter" 
            (input)="applyFilter()" 
            placeholder="Buscar movimientos..." 
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
      </div>

      <!-- Loading y Error -->
      <div *ngIf="loading" class="text-center py-12">
        <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-sm text-gray-500">Cargando movimientos...</p>
      </div>

      <div *ngIf="error" class="rounded-md bg-red-50 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <div class="mt-2 text-sm text-red-700">{{ error }}</div>
          </div>
        </div>
      </div>

      <!-- Tabla de Movimientos -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referencia</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200" *ngIf="(filteredMovements$ | async)?.length; else noData">
            <tr *ngFor="let movimiento of filteredMovements$ | async" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ movimiento.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ movimiento.type }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ movimiento.reference }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ movimiento.productName || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ movimiento.quantity || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ movimiento.status }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ movimiento.date | date:'short' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button (click)="openForm(movimiento)" class="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
                <button (click)="openDeleteModal(movimiento)" class="text-red-600 hover:text-red-900">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #noData>
          <div class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No hay movimientos</h3>
            <p class="mt-1 text-sm text-gray-500">No se encontraron movimientos que coincidan con el filtro.</p>
          </div>
        </ng-template>
      </div>

      <!-- Modal de Formulario -->
      <ng-container *ngIf="showForm">
        <app-movement-form
          *ngIf="showForm"
          (saved)="closeForm()"
          (cancelled)="closeForm()">
        </app-movement-form>
      </ng-container>

      <!-- Modal de Confirmación de Eliminación -->
      <ng-container *ngIf="showDeleteModal">
        <app-confirm-dialog
          [isOpen]="showDeleteModal"
          [title]="'Eliminar Movimiento'"
          [message]="'¿Está seguro de que desea eliminar el movimiento ' + (movementToDelete?.reference || '') + '?'"
          [confirmText]="'Eliminar'"
          [loading]="loading"
          (confirm)="confirmDelete()"
          (cancel)="closeDeleteModal()">
        </app-confirm-dialog>
      </ng-container>
    </div>
  `
})
export class MovementListComponent implements OnInit {
  movements$ = new BehaviorSubject<Movement[]>([]);
  filteredMovements$ = new BehaviorSubject<Movement[]>([]);
  loading = false;
  error: string | null = null;
  filter = '';

  showForm = false;
  editingMovement: Movement | null = null;
  formLoading = false;

  showDeleteModal = false;
  movementToDelete: Movement | null = null;

  constructor(private movementService: MovementService) {}

  ngOnInit() {
    this.loadMovements();
  }

  loadMovements(): void {
    this.loading = true;
    this.error = null;
    this.movementService.getAll().pipe(
      catchError(err => {
        this.error = 'Error al cargar movimientos';
        return of([]);
      }),
      finalize(() => this.loading = false)
    ).subscribe(movements => {
      this.movements$.next(movements);
      this.applyFilter();
    });
  }

  applyFilter(): void {
    const filterValue = this.filter.trim().toLowerCase();
    const filtered = this.movements$.value.filter(mov =>
      (mov.reference?.toLowerCase().includes(filterValue) ?? false) ||
      mov.type.toLowerCase().includes(filterValue)
    );
    this.filteredMovements$.next(filtered);
  }

  openForm(movement?: Movement) {
    this.editingMovement = movement ?? null;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingMovement = null;
  }

  onSaveMovement(data: MovementFormData) {
    this.formLoading = true;
    const obs = this.editingMovement
      ? this.movementService.update(this.editingMovement.id, data)
      : this.movementService.create(data);

    obs.pipe(finalize(() => this.formLoading = false)).subscribe({
      next: () => {
        this.closeForm();
        this.loadMovements();
      },
      error: () => {
        this.error = 'Error al guardar el movimiento';
      }
    });
  }

  openDeleteModal(movement: Movement) {
    this.movementToDelete = movement;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.movementToDelete = null;
  }

  confirmDelete() {
    if (!this.movementToDelete) return;
    this.loading = true;
    this.movementService.delete(this.movementToDelete.id).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.loadMovements();
      },
      error: () => {
        this.error = 'Error al eliminar movimiento';
      }
    });
  }
} 