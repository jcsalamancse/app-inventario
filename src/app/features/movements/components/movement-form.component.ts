import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MovementService } from '../services/movement.service';
import { ProductService } from '../../products/services/product.service';
import { MovementFormData, MovementType } from '../models/movement.model';

@Component({
  selector: 'app-movement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6">
      <h3 class="text-xl font-bold mb-4 text-gray-800">Nuevo Movimiento</h3>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select formControlName="type" class="w-full border rounded-lg px-3 py-2">
            <option value="">Selecciona un tipo</option>
            <option value="0">Entrada</option>
            <option value="1">Salida</option>
            <option value="2">Ajuste</option>
            <option value="3">Transferencia</option>
          </select>
          <div *ngIf="form.get('type')?.invalid && form.get('type')?.touched" class="text-red-500 text-xs mt-1">El tipo es obligatorio.</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Referencia</label>
          <input type="text" formControlName="reference" class="w-full border rounded-lg px-3 py-2" />
          <div *ngIf="form.get('reference')?.invalid && form.get('reference')?.touched" class="text-red-500 text-xs mt-1">La referencia es obligatoria.</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Producto</label>
          <div class="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
            <select
              id="ProductId"
              formControlName="productId"
              size="5"
              class="block w-full bg-white border-0 focus:ring-0 text-sm">
              <option *ngFor="let p of productos" [value]="p.id">
                {{ p.name }}
              </option>
            </select>
          </div>
          <div *ngIf="form.get('productId')?.invalid && form.get('productId')?.touched" class="text-red-500 text-xs mt-1">El producto es obligatorio.</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
          <input type="number" formControlName="quantity" min="1" class="w-full border rounded-lg px-3 py-2" />
          <div *ngIf="form.get('quantity')?.invalid && form.get('quantity')?.touched" class="text-red-500 text-xs mt-1">La cantidad debe ser mayor que 0.</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
          <input type="number" formControlName="price" min="0" class="w-full border rounded-lg px-3 py-2" />
          <div *ngIf="form.get('price')?.invalid && form.get('price')?.touched" class="text-red-500 text-xs mt-1">El precio debe ser mayor o igual a 0.</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación Origen</label>
          <input type="number" formControlName="sourceLocationId" class="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación Destino</label>
          <input type="number" formControlName="destinationLocationId" class="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
          <input type="number" formControlName="locationId" class="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Notas</label>
          <textarea formControlName="notes" class="w-full border rounded-lg px-3 py-2"></textarea>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button type="button" (click)="onCancel()" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">Cancelar</button>
          <button type="submit" [disabled]="form.invalid || loading" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">{{ loading ? 'Guardando...' : 'Guardar' }}</button>
        </div>
        <div *ngIf="error" class="text-red-500 mt-2">{{ error }}</div>
      </form>
    </div>
  `
})
export class MovementFormComponent implements OnInit {
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  form: FormGroup;
  loading = false;
  error: string | null = null;
  productos: { id: number, name: string }[] = [];
  movementTypes: string[] = [];

  constructor(
    private fb: FormBuilder,
    private movementService: MovementService,
    private productService: ProductService
  ) {
    this.form = this.fb.group({
      type: [0, Validators.required],
      reference: ['', Validators.required],
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
      sourceLocationId: [0],
      destinationLocationId: [0],
      locationId: [0, Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    this.productService.getProducts({ page: 1, pageSize: 100 }).subscribe(data => {
      this.productos = (data.Items?.$values || []).map((p: any) => ({
        id: p.Id,
        name: p.Name
      }));
    });

    this.movementTypes = Object.values(MovementType);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;

    const formValue = this.form.value;
    const movementDto = {
      Type: Number(formValue.type),
      Reference: formValue.reference,
      ProductId: Number(formValue.productId),
      Quantity: Number(formValue.quantity),
      SourceLocationId: Number(formValue.sourceLocationId),
      DestinationLocationId: Number(formValue.destinationLocationId),
      LocationId: Number(formValue.locationId),
      Notes: formValue.notes || ''
    };

    this.movementService.createMovement(movementDto).subscribe({
      next: () => {
        this.saved.emit();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al guardar el movimiento';
        this.loading = false;
      }
    });
  }

  capitalizeType(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }

  onCancel() {
    this.cancelled.emit();
  }
} 