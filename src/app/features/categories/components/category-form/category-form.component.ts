import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  template: `
    <app-modal 
      [isOpen]="true" 
      [title]="category ? 'Editar Categoría' : 'Nueva Categoría'"
      (close)="cancel.emit()">
      
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <!-- Nombre -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
          <input 
            type="text" 
            id="name"
            formControlName="name" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            [class.border-red-300]="form.get('name')?.invalid && form.get('name')?.touched"
            placeholder="Ingrese el nombre de la categoría" />
          <div *ngIf="form.get('name')?.invalid && form.get('name')?.touched" 
               class="mt-1 text-sm text-red-600">
            El nombre es requerido
          </div>
        </div>

        <!-- Descripción -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea 
            id="description"
            formControlName="description" 
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Ingrese una descripción (opcional)"></textarea>
        </div>

        <!-- Estado -->
        <div class="flex items-center">
          <input 
            type="checkbox" 
            id="isActive"
            formControlName="isActive" 
            class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <label for="isActive" class="ml-2 block text-sm text-gray-700">
            Categoría activa
          </label>
        </div>
      </form>

      <div modalFooter class="flex justify-end gap-3">
        <button 
          type="button"
          (click)="cancel.emit()"
          class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Cancelar
        </button>
        <button 
          type="button"
          (click)="onSubmit()"
          [disabled]="form.invalid || loading"
          class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <span *ngIf="loading" class="mr-2">
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ category ? 'Actualizar' : 'Crear' }}
        </button>
      </div>
    </app-modal>
  `
})
export class CategoryFormComponent implements OnInit {
  @Input() category: Category | null = null;
  @Input() loading = false;
  @Output() save = new EventEmitter<Partial<Category>>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      isActive: [true]
    });
  }

  ngOnInit() {
    if (this.category) {
      this.form.patchValue(this.category);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        control?.markAsTouched();
      });
    }
  }
} 