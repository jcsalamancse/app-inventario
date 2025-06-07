import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { ProductDto } from '../../models/product.model';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    MatCardModule
  ],
  template: `
    <div class="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl max-w-5xl mx-auto overflow-hidden">
      <!-- Header with Gradient -->
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="bg-white/20 p-2 rounded-lg">
              <mat-icon class="text-white text-3xl">inventory_2</mat-icon>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-white">
                {{ data ? 'Editar' : 'Nuevo' }} Producto
              </h2>
              <p class="text-indigo-100 text-sm mt-1">
                Complete la información del producto
              </p>
            </div>
          </div>
          <button 
            mat-icon-button 
            mat-dialog-close
            class="text-white hover:bg-white/20 rounded-full"
            aria-label="Cerrar diálogo">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <!-- Form Content -->
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="p-6">
        <div class="space-y-6">
          <!-- Loading State -->
          <div *ngIf="isLoading" class="flex justify-center items-center py-4">
            <mat-spinner diameter="40" color="accent"></mat-spinner>
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-lg">
            <div class="flex">
              <div class="flex-shrink-0">
                <mat-icon class="text-red-500">error</mat-icon>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Basic Information Section -->
          <mat-card class="overflow-hidden shadow-sm">
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <div class="flex items-center space-x-4">
                <div class="bg-indigo-100 p-2.5 rounded-lg shadow-sm flex items-center justify-center">
                  <mat-icon class="text-indigo-600 text-xl">info</mat-icon>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 mb-0.5">Información Básica</h3>
                  <p class="text-sm text-gray-500">Datos principales del producto</p>
                </div>
              </div>
            </div>
            <div class="p-6 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <!-- Name Field -->
                <mat-form-field appearance="outline" class="w-full h-16 flex items-center" [class.mat-form-field-invalid]="productForm.get('name')?.invalid && productForm.get('name')?.touched">
                  <mat-label class="text-gray-700">Nombre</mat-label>
                  <input 
                    matInput 
                    formControlName="name"
                    placeholder="Ingrese el nombre del producto"
                    class="text-gray-800"
                  />
                  <mat-error *ngIf="productForm.get('name')?.hasError('required')">
                    El nombre es requerido
                  </mat-error>
                </mat-form-field>

                <!-- Code Field -->
                <mat-form-field appearance="outline" class="w-full h-16 flex items-center" [class.mat-form-field-invalid]="productForm.get('code')?.invalid && productForm.get('code')?.touched">
                  <mat-label class="text-gray-700">Código</mat-label>
                  <input 
                    matInput 
                    formControlName="code"
                    placeholder="Ingrese el código del producto"
                    class="text-gray-800"
                  />
                  <mat-error *ngIf="productForm.get('code')?.hasError('required')">
                    El código es requerido
                  </mat-error>
                </mat-form-field>

                <!-- Description Field -->
                <mat-form-field appearance="outline" class="w-full md:col-span-2" style="min-height: 56px;">
                  <mat-label class="text-gray-700">Descripción</mat-label>
                  <textarea 
                    matInput 
                    formControlName="description"
                    rows="3"
                    placeholder="Ingrese la descripción del producto"
                    class="text-gray-800"
                  ></textarea>
                </mat-form-field>
              </div>
            </div>
          </mat-card>

          <!-- Inventory Information Section -->
          <mat-card class="overflow-hidden shadow-sm mt-6">
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
              <div class="flex items-center space-x-4">
                <div class="bg-emerald-100 p-2.5 rounded-lg shadow-sm flex items-center justify-center">
                  <mat-icon class="text-emerald-600 text-xl">inventory</mat-icon>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 mb-0.5">Información de Inventario</h3>
                  <p class="text-sm text-gray-500">Control de stock y precios</p>
                </div>
              </div>
            </div>
            <div class="p-6 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <!-- Price Field -->
                <mat-form-field appearance="outline" class="w-full h-16 flex items-center" [class.mat-form-field-invalid]="productForm.get('price')?.invalid && productForm.get('price')?.touched">
                  <mat-label class="text-gray-700">Precio</mat-label>
                  <span matPrefix class="flex items-center"><mat-icon class="text-emerald-600 mr-2">attach_money</mat-icon></span>
                  <input 
                    matInput 
                    type="number" 
                    formControlName="price"
                    placeholder="0.00"
                    class="text-gray-800"
                  />
                  <mat-error *ngIf="productForm.get('price')?.hasError('required')">
                    El precio es requerido
                  </mat-error>
                  <mat-error *ngIf="productForm.get('price')?.hasError('min')">
                    El precio debe ser mayor a 0
                  </mat-error>
                </mat-form-field>

                <!-- Current Stock Field -->
                <mat-form-field appearance="outline" class="w-full h-16 flex items-center" [class.mat-form-field-invalid]="productForm.get('currentStock')?.invalid && productForm.get('currentStock')?.touched">
                  <mat-label class="text-gray-700">Stock Actual</mat-label>
                  <span matPrefix class="flex items-center"><mat-icon class="text-emerald-600 mr-2">inventory</mat-icon></span>
                  <input 
                    matInput 
                    type="number" 
                    formControlName="currentStock"
                    placeholder="0"
                    class="text-gray-800"
                  />
                  <mat-error *ngIf="productForm.get('currentStock')?.hasError('required')">
                    El stock es requerido
                  </mat-error>
                </mat-form-field>

                <!-- Minimum Stock Field -->
                <mat-form-field appearance="outline" class="w-full h-16 flex items-center" [class.mat-form-field-invalid]="productForm.get('minimumStock')?.invalid && productForm.get('minimumStock')?.touched">
                  <mat-label class="text-gray-700">Stock Mínimo</mat-label>
                  <span matPrefix class="flex items-center"><mat-icon class="text-amber-600 mr-2">warning</mat-icon></span>
                  <input 
                    matInput 
                    type="number" 
                    formControlName="minimumStock"
                    placeholder="0"
                    class="text-gray-800"
                  />
                  <mat-error *ngIf="productForm.get('minimumStock')?.hasError('required')">
                    El stock mínimo es requerido
                  </mat-error>
                </mat-form-field>

                <!-- Maximum Stock Field -->
                <mat-form-field appearance="outline" class="w-full h-16 flex items-center" [class.mat-form-field-invalid]="productForm.get('maximumStock')?.invalid && productForm.get('maximumStock')?.touched">
                  <mat-label class="text-gray-700">Stock Máximo</mat-label>
                  <span matPrefix class="flex items-center"><mat-icon class="text-emerald-600 mr-2">storage</mat-icon></span>
                  <input 
                    matInput 
                    type="number" 
                    formControlName="maximumStock"
                    placeholder="0"
                    class="text-gray-800"
                  />
                  <mat-error *ngIf="productForm.get('maximumStock')?.hasError('required')">
                    El stock máximo es requerido
                  </mat-error>
                </mat-form-field>
              </div>
            </div>
          </mat-card>

          <!-- Classification Section -->
          <mat-card class="overflow-hidden shadow-sm mt-6">
            <div class="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <div class="flex items-center space-x-4">
                <div class="bg-purple-100 p-2.5 rounded-lg shadow-sm flex items-center justify-center">
                  <mat-icon class="text-purple-600 text-xl">category</mat-icon>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 mb-0.5">Clasificación</h3>
                  <p class="text-sm text-gray-500">Categorización y proveedores</p>
                </div>
              </div>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-stretch">
                <!-- Category Field -->
                <div class="flex flex-col h-full">
                  <mat-form-field appearance="outline" class="w-full flex-1 min-h-[64px]" [class.mat-form-field-invalid]="productForm.get('categoryId')?.invalid && productForm.get('categoryId')?.touched">
                    <mat-label class="text-gray-700 max-w-full truncate whitespace-nowrap overflow-hidden text-ellipsis">Categoría</mat-label>
                    <span matPrefix class="flex items-center"><mat-icon class="text-purple-600 mr-2">category</mat-icon></span>
                    <mat-select formControlName="categoryId" class="text-gray-800">
                      <mat-option *ngFor="let category of categories" [value]="category.id">
                        {{category.name}}
                      </mat-option>
                    </mat-select>
                    <mat-error *ngIf="productForm.get('categoryId')?.hasError('required')">
                      La categoría es requerida
                    </mat-error>
                  </mat-form-field>
                </div>
                <!-- Unit Field -->
                <div class="flex flex-col h-full">
                  <mat-form-field appearance="outline" class="w-full flex-1 min-h-[64px]" [class.mat-form-field-invalid]="productForm.get('unitId')?.invalid && productForm.get('unitId')?.touched">
                    <mat-label class="text-gray-700 max-w-full truncate whitespace-nowrap overflow-hidden text-ellipsis">Unidad</mat-label>
                    <span matPrefix class="flex items-center"><mat-icon class="text-purple-600 mr-2">straighten</mat-icon></span>
                    <mat-select formControlName="unitId" class="text-gray-800">
                      <mat-option *ngFor="let unit of units" [value]="unit.id">
                        {{unit.name}}
                      </mat-option>
                    </mat-select>
                    <mat-error *ngIf="productForm.get('unitId')?.hasError('required')">
                      La unidad es requerida
                    </mat-error>
                  </mat-form-field>
                </div>
                <!-- Supplier Field -->
                <div class="flex flex-col h-full md:col-span-1">
                  <mat-form-field appearance="outline" class="w-full flex-1 min-h-[64px]" >
                    <mat-label class="text-gray-700 max-w-full truncate whitespace-nowrap overflow-hidden text-ellipsis">Proveedor</mat-label>
                    <span matPrefix class="flex items-center"><mat-icon class="text-purple-600 mr-2">local_shipping</mat-icon></span>
                    <mat-select formControlName="supplierId" class="text-gray-800">
                      <mat-option *ngFor="let supplier of suppliers" [value]="supplier.id">
                        {{supplier.name}}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
                <!-- Active Toggle -->
                <div class="flex items-center justify-center h-full md:col-span-1">
                  <div class="flex items-center w-full h-[64px] bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <mat-slide-toggle formControlName="isActive" color="primary" class="mt-0">
                      <span class="text-gray-700 font-medium">Activo</span>
                    </mat-slide-toggle>
                    <mat-icon class="text-purple-600 ml-2">toggle_on</mat-icon>
                  </div>
                </div>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Form Actions -->
        <div class="mt-8 flex justify-end space-x-4">
          <button 
            mat-stroked-button 
            type="button" 
            (click)="onCancel()"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button 
            mat-raised-button 
            color="primary" 
            type="submit"
            [disabled]="productForm.invalid || isLoading"
            class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span *ngIf="isLoading" class="mr-2">
              <mat-spinner diameter="20" color="accent"></mat-spinner>
            </span>
            {{ data ? 'Guardar' : 'Crear' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  units: any[] = [];
  categories: any[] = [];
  suppliers: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductDto,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0)]],
      unitId: [null, Validators.required],
      currentStock: [0, [Validators.required, Validators.min(0)]],
      minimumStock: [0, [Validators.required, Validators.min(0)]],
      maximumStock: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
      supplierId: [null],
      isActive: [true]
    });
  }

  ngOnInit() {
    if (this.data) {
      this.productForm.patchValue(this.data);
    }
    this.loadFormData();
  }

  loadFormData() {
    this.isLoading = true;
    // TODO: Implementar carga de datos para los selectores
    this.units = [];
    this.categories = [];
    this.suppliers = [];
    this.isLoading = false;
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const productData = this.productForm.value;

      const request$ = this.data
        ? this.productService.updateProduct(this.data.id, productData)
        : this.productService.createProduct(productData);

      request$.subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.snackBar.open(
            `Producto ${this.data ? 'actualizado' : 'creado'} exitosamente`,
            'Cerrar',
            {
              duration: 3000,
              panelClass: ['success-snackbar']
            }
          );
        },
        error: (error) => {
          console.error('Error:', error);
          this.errorMessage = error.message || 'Ha ocurrido un error al procesar la solicitud';
          this.isLoading = false;
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 