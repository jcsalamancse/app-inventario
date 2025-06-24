import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ProductDto } from '../../models/product.model';
import { CategoryService } from '../../../categories/services/category.service';
import { UnitService } from '../../services/unit.service';
import { SupplierService } from '../../services/supplier.service';
import { WarehouseService } from '../../services/warehouse.service';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="space-y-6">
      
      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex justify-center items-center py-8">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span class="text-slate-600">Guardando producto...</span>
        </div>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ errorMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Información Básica -->
      <div class="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div class="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div class="flex items-center space-x-3">
            <div class="bg-slate-200 p-2 rounded-lg">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-slate-900">Información Básica</h3>
              <p class="text-sm text-slate-500">Datos principales del producto</p>
            </div>
          </div>
        </div>
        <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <!-- Nombre -->
            <div class="space-y-2 sm:col-span-2 lg:col-span-1">
              <label class="block text-sm font-medium text-slate-700">Nombre *</label>
              <input
                type="text"
                formControlName="name"
                placeholder="Ingrese el nombre del producto"
                class="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 placeholder-slate-500"
                [class]="getFieldClass('name')"
              />
              <div *ngIf="productForm.get('name')?.invalid && productForm.get('name')?.touched" class="text-sm text-red-600">
                El nombre es requerido
              </div>
            </div>

            <!-- Código -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Código *</label>
              <input
                type="text"
                formControlName="code"
                placeholder="Ingrese el código del producto"
                class="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 placeholder-slate-500"
                [class]="getFieldClass('code')"
              />
              <div *ngIf="productForm.get('code')?.invalid && productForm.get('code')?.touched" class="text-sm text-red-600">
                El código es requerido
              </div>
            </div>

            <!-- Categoría -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Categoría *</label>
              <select
                formControlName="categoryId"
                class="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 bg-white"
                [class]="getFieldClass('categoryId')"
              >
                <option value="">Seleccione una categoría</option>
                <option *ngFor="let category of categories" [value]="category.id">
                  {{ category.name }}
                </option>
              </select>
              <div *ngIf="productForm.get('categoryId')?.invalid && productForm.get('categoryId')?.touched" class="text-sm text-red-600">
                La categoría es requerida
              </div>
            </div>

            <!-- Unidad -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Unidad *</label>
              <select formControlName="unitId" class="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 bg-white">
                <option value="">Seleccione una unidad</option>
                <option *ngFor="let unit of filteredUnits" [value]="unit.id">{{ unit.name }} ({{ unit.symbol }})</option>
              </select>
              <div *ngIf="productForm.get('unitId')?.invalid && productForm.get('unitId')?.touched" class="text-sm text-red-600">
                La unidad es requerida
              </div>
              <div class="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 mt-2">
                <button type="button" *ngIf="filteredUnits.length === 0" (click)="showAddUnit = true" class="text-xs text-indigo-600 hover:underline focus:outline-none">
                  ¿No hay unidades? Agregar nueva unidad
                </button>
                <button type="button" (click)="showAllUnits = !showAllUnits" class="text-xs text-slate-600 hover:underline focus:outline-none">
                  {{ showAllUnits ? 'Ocultar' : 'Ver' }} todas las unidades
                </button>
              </div>
              
              <!-- Lista de todas las unidades -->
              <div *ngIf="showAllUnits" class="mt-3 p-3 bg-slate-50 rounded-lg max-h-40 overflow-y-auto">
                <div class="text-xs font-medium text-slate-700 mb-2">Todas las unidades disponibles:</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                  <div *ngFor="let unit of allUnits" 
                       (click)="selectUnit(unit.id)"
                       class="p-1 cursor-pointer hover:bg-slate-200 rounded text-slate-600 hover:text-slate-900">
                    {{ unit.name }} ({{ unit.symbol }})
                  </div>
                </div>
              </div>
              
              <!-- Modal agregar unidad -->
              <div *ngIf="showAddUnit" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
                <div class="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md relative">
                  <button type="button" (click)="showAddUnit = false" class="absolute top-2 right-2 text-slate-400 hover:text-slate-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                  <h4 class="text-lg font-semibold mb-4 text-slate-900">Agregar nueva unidad</h4>
                  <form [formGroup]="addUnitForm" (ngSubmit)="onAddUnit()" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-700">Nombre *</label>
                      <input type="text" formControlName="name" class="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                      <div *ngIf="addUnitForm.get('name')?.invalid && addUnitForm.get('name')?.touched" class="text-xs text-red-600">El nombre es requerido</div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-slate-700">Símbolo *</label>
                      <input type="text" formControlName="symbol" class="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                      <div *ngIf="addUnitForm.get('symbol')?.invalid && addUnitForm.get('symbol')?.touched" class="text-xs text-red-600">El símbolo es requerido</div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-slate-700">Tipo de unidad</label>
                      <select formControlName="type" class="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                        <option value="">Seleccione un tipo</option>
                        <option value="weight">Peso</option>
                        <option value="volume">Volumen</option>
                        <option value="length">Longitud</option>
                        <option value="size">Talla de ropa</option>
                        <option value="shoe_size">Talla de zapato</option>
                        <option value="area">Área</option>
                        <option value="time">Tiempo</option>
                        <option value="quantity">Cantidad</option>
                        <option value="energy">Energía</option>
                        <option value="temperature">Temperatura</option>
                        <option value="pressure">Presión</option>
                        <option value="speed">Velocidad</option>
                        <option value="frequency">Frecuencia</option>
                        <option value="data">Datos</option>
                        <option value="angle">Ángulo</option>
                        <option value="concentration">Concentración</option>
                        <option value="force">Fuerza</option>
                      </select>
                    </div>
                    <div *ngIf="addUnitError" class="text-xs text-red-600">{{ addUnitError }}</div>
                    <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
                      <button type="button" (click)="showAddUnit = false" class="px-3 py-1 text-xs bg-slate-100 rounded-lg hover:bg-slate-200">Cancelar</button>
                      <button type="submit" [disabled]="addUnitForm.invalid || isAddingUnit" class="px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                        <span *ngIf="isAddingUnit" class="animate-spin inline-block w-4 h-4 border-b-2 border-white mr-1"></span>
                        Guardar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <!-- Proveedor -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Proveedor *</label>
              <select formControlName="supplierId" class="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 bg-white">
                <option value="">Seleccione un proveedor</option>
                <option *ngFor="let supplier of suppliers" [value]="supplier.id">{{ supplier.name }}</option>
              </select>
              <div *ngIf="productForm.get('supplierId')?.invalid && productForm.get('supplierId')?.touched" class="text-sm text-red-600">
                El proveedor es requerido
              </div>
            </div>

            <!-- Almacén -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Almacén *</label>
              <select formControlName="warehouseId" class="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 bg-white">
                <option value="">Seleccione un almacén</option>
                <option *ngFor="let warehouse of warehouses" [value]="warehouse.id">{{ warehouse.name }}</option>
              </select>
              <div *ngIf="productForm.get('warehouseId')?.invalid && productForm.get('warehouseId')?.touched" class="text-sm text-red-600">
                El almacén es requerido
              </div>
            </div>

            <!-- Ubicación -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Ubicación *</label>
              <select formControlName="locationId" class="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 bg-white">
                <option value="">Seleccione una ubicación</option>
                <option *ngFor="let location of locations" [value]="location.id">{{ location.name }}</option>
              </select>
              <div *ngIf="productForm.get('locationId')?.invalid && productForm.get('locationId')?.touched" class="text-sm text-red-600">
                La ubicación es requerida
              </div>
            </div>
          </div>

          <!-- Descripción -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">Descripción</label>
            <textarea
              formControlName="description"
              rows="3"
              placeholder="Ingrese la descripción del producto"
              class="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 placeholder-slate-500"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Información de Inventario -->
      <div class="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div class="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div class="flex items-center space-x-3">
            <div class="bg-emerald-100 p-2 rounded-lg">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-slate-900">Información de Inventario</h3>
              <p class="text-sm text-slate-500">Control de stock y precios</p>
            </div>
          </div>
        </div>
        <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <!-- Precio -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Precio *</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-slate-500 text-sm">$</span>
                </div>
                <input
                  type="number"
                  formControlName="price"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  class="block w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 placeholder-slate-500"
                  [class]="getFieldClass('price')"
                />
              </div>
              <div *ngIf="productForm.get('price')?.invalid && productForm.get('price')?.touched" class="text-sm text-red-600">
                <span *ngIf="productForm.get('price')?.hasError('required')">El precio es requerido</span>
                <span *ngIf="productForm.get('price')?.hasError('min')">El precio debe ser mayor a 0</span>
              </div>
            </div>

            <!-- Stock Actual -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Stock Actual *</label>
              <input
                type="number"
                formControlName="currentStock"
                placeholder="0"
                min="0"
                class="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 placeholder-slate-500"
                [class]="getFieldClass('currentStock')"
              />
              <div *ngIf="productForm.get('currentStock')?.invalid && productForm.get('currentStock')?.touched" class="text-sm text-red-600">
                El stock actual es requerido
              </div>
            </div>

            <!-- Stock Mínimo -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Stock Mínimo *</label>
              <input
                type="number"
                formControlName="minimumStock"
                placeholder="0"
                min="0"
                class="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 placeholder-slate-500"
                [class]="getFieldClass('minimumStock')"
              />
              <div *ngIf="productForm.get('minimumStock')?.invalid && productForm.get('minimumStock')?.touched" class="text-sm text-red-600">
                El stock mínimo es requerido
              </div>
            </div>

            <!-- Stock Máximo -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Stock Máximo *</label>
              <input
                type="number"
                formControlName="maximumStock"
                placeholder="0"
                min="0"
                class="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 placeholder-slate-500"
                [class]="getFieldClass('maximumStock')"
              />
              <div *ngIf="productForm.get('maximumStock')?.invalid && productForm.get('maximumStock')?.touched" class="text-sm text-red-600">
                El stock máximo es requerido
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Clasificación -->
      <div class="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div class="px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div class="flex items-center space-x-3">
            <div class="bg-purple-100 p-2 rounded-lg">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-slate-900">Clasificación</h3>
              <p class="text-sm text-slate-500">Categorización y estado</p>
            </div>
          </div>
        </div>
        <div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <!-- Estado -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Estado</label>
              <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <label class="flex items-center">
                  <input
                    type="radio"
                    formControlName="isActive"
                    [value]="true"
                    class="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  <span class="ml-2 text-sm text-slate-700">Activo</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    formControlName="isActive"
                    [value]="false"
                    class="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  <span class="ml-2 text-sm text-slate-700">Inactivo</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de Acción -->
      <div class="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-slate-200">
        <button
          type="button"
          (click)="handleCancel()"
          class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          [disabled]="productForm.invalid || isLoading"
          class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <div *ngIf="isLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {{ product ? 'Actualizar' : 'Crear' }} Producto
        </button>
      </div>
    </form>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() product: ProductDto | null = null;
  @Output() onSave = new EventEmitter<ProductDto>();
  @Output() onCancel = new EventEmitter<void>();

  productForm: FormGroup;
  categories: any[] = [];
  units: any[] = [];
  filteredUnits: any[] = [];
  suppliers: any[] = [];
  warehouses: any[] = [];
  locations: any[] = [];
  isLoading = false;
  errorMessage = '';

  showAddUnit = false;
  isAddingUnit = false;
  addUnitError = '';
  addUnitForm: FormGroup;

  showAllUnits = false;
  allUnits: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private unitService: UnitService,
    private supplierService: SupplierService,
    private warehouseService: WarehouseService,
    private locationService: LocationService,
    private cdr: ChangeDetectorRef
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      currentStock: [0, [Validators.required, Validators.min(0)]],
      minimumStock: [0, [Validators.required, Validators.min(0)]],
      maximumStock: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, [Validators.required, Validators.min(1)]],
      unitId: [null, [Validators.required, Validators.min(1)]],
      supplierId: [null, [Validators.required, Validators.min(1)]],
      warehouseId: [null, [Validators.required, Validators.min(1)]],
      locationId: [null, [Validators.required, Validators.min(1)]],
      isActive: [true]
    });
    this.addUnitForm = this.fb.group({
      name: ['', Validators.required],
      symbol: ['', Validators.required],
      type: ['']
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadUnits();
    this.loadSuppliers();
    this.loadWarehouses();
    this.loadLocations();
    
    // Cargar todas las unidades para el selector
    this.unitService.getUnits().subscribe(units => {
      this.allUnits = units;
    });

    // Suscribirse a cambios de categoría
    this.productForm.get('categoryId')?.valueChanges.subscribe(() => {
      this.filterUnitsByCategory();
    });

    // Si hay un producto para editar, cargar los datos después de que los catálogos estén listos
    if (this.product) {
      this.loadFormDataAfterCatalogs();
    }
  }

  ngOnChanges(changes: any) {
    if (changes.product && changes.product.currentValue && !changes.product.firstChange) {
      console.log('Producto cambiado, recargando datos:', changes.product.currentValue);
      // Solo recargar si es un producto diferente
      if (!this.product || this.product.id !== changes.product.currentValue.id) {
        this.loadFormDataAfterCatalogs();
      }
    }
  }

  loadFormDataAfterCatalogs() {
    // Esperar a que todos los catálogos estén cargados
    const checkCatalogsLoaded = () => {
      if (this.categories.length > 0 && this.units.length > 0 && 
          this.suppliers.length > 0 && this.warehouses.length > 0 && 
          this.locations.length > 0) {
        console.log('Todos los catálogos cargados, llenando formulario');
        this.loadFormData();
      } else {
        console.log('Esperando catálogos...', {
          categories: this.categories.length,
          units: this.units.length,
          suppliers: this.suppliers.length,
          warehouses: this.warehouses.length,
          locations: this.locations.length
        });
        // Reintentar después de un breve delay
        setTimeout(checkCatalogsLoaded, 200);
      }
    };
    checkCatalogsLoaded();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response || [];
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  loadUnits() {
    this.unitService.getUnits().subscribe({
      next: (units) => {
        this.units = units;
        // Si estamos editando, mostrar todas las unidades
        if (this.product) {
          this.filteredUnits = this.units;
        } else {
          this.filterUnitsByCategory();
        }
      },
      error: () => {
        this.units = [];
        this.filteredUnits = [];
      }
    });
  }

  filterUnitsByCategory() {
    const categoryId = this.productForm.get('categoryId')?.value;
    
    // Si estamos editando un producto, mostrar todas las unidades disponibles
    // para que el usuario pueda cambiar la unidad si es necesario
    if (this.product) {
      this.filteredUnits = this.units;
    } else {
      // Si estamos creando, filtrar por categoría si las unidades tienen categoryId
      if (categoryId && this.units.length > 0 && this.units[0].categoryId !== undefined) {
        this.filteredUnits = this.units.filter((u: any) => u.categoryId === categoryId);
      } else {
        this.filteredUnits = this.units;
      }
    }
    
    this.cdr.markForCheck();
  }

  onCategoryChange() {
    this.filterUnitsByCategory();
  }

  onAddUnit() {
    if (this.addUnitForm.invalid) return;
    this.isAddingUnit = true;
    this.addUnitError = '';
    const categoryId = this.productForm.get('categoryId')?.value;
    const { name, symbol, type } = this.addUnitForm.value;
    this.unitService.createUnit({ name, symbol, categoryId, type }).subscribe({
      next: (unit) => {
        this.showAddUnit = false;
        this.isAddingUnit = false;
        this.addUnitForm.reset();
        this.loadUnits();
        setTimeout(() => {
          this.productForm.get('unitId')?.setValue(unit.id);
          this.cdr.markForCheck();
        }, 300);
      },
      error: (err) => {
        this.isAddingUnit = false;
        this.addUnitError = err?.error?.message || 'Error al agregar la unidad';
        this.cdr.markForCheck();
      }
    });
  }

  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers: any[]) => this.suppliers = suppliers,
      error: () => this.suppliers = []
    });
  }

  loadWarehouses() {
    this.warehouseService.getWarehouses().subscribe({
      next: (warehouses) => this.warehouses = warehouses,
      error: () => this.warehouses = []
    });
  }

  loadLocations() {
    this.locationService.getLocations().subscribe({
      next: (locations) => this.locations = locations,
      error: () => this.locations = []
    });
  }

  loadFormData() {
    if (this.product) {
      console.log('Cargando datos del producto para editar:', this.product);
      this.productForm.patchValue({
        name: this.product.name,
        code: this.product.code || this.product.sku || '',
        description: this.product.description || '',
        price: this.product.price,
        currentStock: this.product.currentStock,
        minimumStock: this.product.minimumStock,
        maximumStock: this.product.maximumStock,
        categoryId: this.product.categoryId,
        unitId: this.product.unitId,
        supplierId: this.product.supplierId,
        warehouseId: this.product.warehouseId,
        locationId: this.product.locationId,
        isActive: this.product.isActive
      });
      console.log('Formulario cargado con valores:', this.productForm.value);
      
      // Al editar, mostrar todas las unidades disponibles
      this.filteredUnits = this.units;
      this.cdr.markForCheck();
    }
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    const formValue = this.productForm.value;
    const payload = {
      name: formValue.name,
      code: formValue.code,
      description: formValue.description,
      price: Number(formValue.price),
      currentStock: Number(formValue.currentStock),
      minimumStock: Number(formValue.minimumStock),
      maximumStock: Number(formValue.maximumStock),
      categoryId: Number(formValue.categoryId),
      unitId: Number(formValue.unitId),
      supplierId: Number(formValue.supplierId),
      warehouseId: Number(formValue.warehouseId),
      locationId: Number(formValue.locationId),
      isActive: formValue.isActive
    };

    console.log('Enviando payload:', payload);
    console.log('¿Es edición?', !!this.product);

    if (this.product) {
      // Actualizar producto existente
      this.productService.updateProduct(this.product.id, payload).subscribe({
        next: (product) => {
          console.log('Producto actualizado:', product);
          this.isLoading = false;
          this.onSave.emit(product);
        },
        error: (error) => {
          console.error('Error al actualizar producto:', error);
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al actualizar el producto';
        }
      });
    } else {
      // Crear nuevo producto
      this.productService.createProduct(payload).subscribe({
        next: (product) => {
          console.log('Producto creado:', product);
          this.isLoading = false;
          this.onSave.emit(product);
        },
        error: (error) => {
          console.error('Error al crear producto:', error);
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al guardar el producto';
        }
      });
    }
  }

  getFieldClass(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      return 'border-red-300 focus:ring-red-500 focus:border-red-500';
    }
    return '';
  }

  selectUnit(unitId: number) {
    this.productForm.get('unitId')?.setValue(unitId);
    this.showAllUnits = false;
    this.cdr.markForCheck();
  }

  clearForm() {
    this.productForm.reset();
    this.errorMessage = '';
    this.showAddUnit = false;
    this.addUnitForm.reset();
    this.filteredUnits = this.units;
    this.cdr.markForCheck();
  }

  handleCancel() {
    this.clearForm();
    this.onCancel.emit();
  }
} 