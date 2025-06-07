import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, ProductDto, ProductFilter, ProductPaginationResult } from '../../models/product.model';
import { ProductFormComponent } from '../product-form/product-form.component';
import { catchError, of } from 'rxjs';
import { CategoryService } from '../../../categories/services/category.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatMenuModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatProgressBarModule,
    RouterModule
  ],
  template: `
    <div class="container mx-auto p-4">
      <!-- Header con estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <mat-card class="bg-blue-50">
          <mat-card-content class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Total Productos</p>
                <p class="text-2xl font-bold text-blue-600">{{totalProducts}}</p>
              </div>
              <mat-icon class="text-blue-500">inventory_2</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="bg-yellow-50">
          <mat-card-content class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Stock Bajo</p>
                <p class="text-2xl font-bold text-yellow-600">{{lowStockCount}}</p>
              </div>
              <mat-icon class="text-yellow-500">warning</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="bg-green-50">
          <mat-card-content class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Activos</p>
                <p class="text-2xl font-bold text-green-600">{{activeProducts}}</p>
              </div>
              <mat-icon class="text-green-500">check_circle</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="bg-purple-50">
          <mat-card-content class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Valor Total</p>
                <p class="text-2xl font-bold text-purple-600">{{totalValue | currency}}</p>
              </div>
              <mat-icon class="text-purple-500">attach_money</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Filtros avanzados -->
      <mat-card class="mb-6">
        <mat-card-content class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <mat-form-field class="w-full">
              <mat-label>Buscar</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Buscar productos...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field class="w-full">
              <mat-label>Categoría</mat-label>
              <mat-select multiple [(ngModel)]="categorySelected" (selectionChange)="applyFilters()">
                <mat-option *ngFor="let category of categories" [value]="category.id">
                  {{category.name}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field class="w-full">
              <mat-label>Rango de Precios</mat-label>
              <mat-select [(ngModel)]="priceRangeSelected" (selectionChange)="applyFilters()">
                <mat-option value="0-100">$0 - $100</mat-option>
                <mat-option value="100-500">$100 - $500</mat-option>
                <mat-option value="500+">$500+</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field class="w-full">
              <mat-label>Estado</mat-label>
              <mat-select [(ngModel)]="statusSelected" (selectionChange)="applyFilters()">
                <mat-option value="all">Todos</mat-option>
                <mat-option value="active">Activos</mat-option>
                <mat-option value="inactive">Inactivos</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Tabla de productos -->
      <mat-card>
        <mat-card-header class="flex justify-between items-center p-4">
          <mat-card-title>Lista de Productos</mat-card-title>
          <button mat-raised-button color="primary" (click)="openProductDialog()">
            <mat-icon>add</mat-icon>
            Nuevo Producto
          </button>
        </mat-card-header>

        <mat-card-content>
          @if (loading) {
            <div class="flex justify-center items-center p-8">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table mat-table [dataSource]="dataSource" matSort class="w-full">
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                  <td mat-cell *matCellDef="let row">{{row.Id}}</td>
                </ng-container>
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
                  <td mat-cell *matCellDef="let row">{{row.Name}}</td>
                </ng-container>
                <ng-container matColumnDef="description">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Descripción</th>
                  <td mat-cell *matCellDef="let row">{{row.Description}}</td>
                </ng-container>
                <ng-container matColumnDef="price">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Precio</th>
                  <td mat-cell *matCellDef="let row">{{row.Price | currency}}</td>
                </ng-container>
                <ng-container matColumnDef="currentStock">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Stock Actual</th>
                  <td mat-cell *matCellDef="let row">{{row.CurrentStock}}</td>
                </ng-container>
                <ng-container matColumnDef="minimumStock">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Stock Mínimo</th>
                  <td mat-cell *matCellDef="let row">{{row.MinimumStock}}</td>
                </ng-container>
                <ng-container matColumnDef="maximumStock">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Stock Máximo</th>
                  <td mat-cell *matCellDef="let row">{{row.MaximumStock}}</td>
                </ng-container>
                <ng-container matColumnDef="categoryName">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Categoría</th>
                  <td mat-cell *matCellDef="let row">{{row.CategoryName}}</td>
                </ng-container>
                <ng-container matColumnDef="unitName">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Unidad</th>
                  <td mat-cell *matCellDef="let row">{{row.UnitName}}</td>
                </ng-container>
                <ng-container matColumnDef="isActive">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th>
                  <td mat-cell *matCellDef="let row">
                    <mat-chip [color]="row.IsActive ? 'primary' : 'warn'" selected>
                      {{row.IsActive ? 'Activo' : 'Inactivo'}}
                    </mat-chip>
                  </td>
                </ng-container>
                <ng-container matColumnDef="createdAt">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Creado</th>
                  <td mat-cell *matCellDef="let row">{{row.CreatedAt | date:'short'}}</td>
                </ng-container>
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Acciones</th>
                  <td mat-cell *matCellDef="let row">
                    <button mat-icon-button (click)="editProduct(row)"><mat-icon>edit</mat-icon></button>
                    <button mat-icon-button (click)="deleteProduct(row)"><mat-icon>delete</mat-icon></button>
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </div>

            <mat-paginator 
              [pageSizeOptions]="[5, 10, 25, 100]" 
              [pageSize]="10"
              (page)="onPageChange($event)"
              aria-label="Seleccionar página de productos">
            </mat-paginator>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1400px;
    }
    .mat-column-actions {
      width: 80px;
      text-align: center;
    }
    .stock-warning {
      color: #f44336;
    }
    .stock-normal {
      color: #4caf50;
    }
    .mat-progress-bar {
      height: 8px;
      border-radius: 4px;
    }
  `]
})
export class ProductsListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'price',
    'currentStock',
    'minimumStock',
    'maximumStock',
    'categoryName',
    'unitName',
    'isActive',
    'createdAt',
    'actions'
  ];
  dataSource: MatTableDataSource<ProductDto> = new MatTableDataSource<ProductDto>([]);
  filter: ProductFilter = {};
  categories: any[] = [];
  loading = false;
  totalProducts = 0;
  lowStockCount = 0;
  activeProducts = 0;
  totalValue = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ProductDto>;

  categorySelected: number[] = [];
  priceRangeSelected: string = '';
  statusSelected: string = '';

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
    this.loadStatistics();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error al cargar categorías', error);
      }
    });
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts(this.filter).pipe(
      catchError(error => {
        console.error('Error al cargar productos:', error);
        this.snackBar.open('Error al conectar con el servidor. Por favor, intente nuevamente.', 'Cerrar', {
          duration: 5000
        });
        this.loading = false;
        return of({
          Items: { $values: [] },
          TotalCount: 0,
          PageNumber: 1,
          PageSize: 10,
          TotalPages: 1,
          HasPreviousPage: false,
          HasNextPage: false
        });
      })
    ).subscribe({
      next: (response) => {
        if (response && response.Items && Array.isArray(response.Items.$values)) {
          this.dataSource.data = response.Items.$values;
          this.totalProducts = response.TotalCount;
        } else {
          this.dataSource.data = [];
          this.totalProducts = 0;
          console.error('Formato de respuesta inválido:', response);
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.dataSource.data = [];
        this.totalProducts = 0;
      }
    });
  }

  loadStatistics() {
    // Cargar productos con stock bajo
    this.productService.getLowStockProducts().pipe(
      catchError(error => {
        console.error('Error al cargar productos con stock bajo:', error);
        return of({ $values: [] });
      })
    ).subscribe({
      next: (response) => {
        if (response && response.$values) {
          this.lowStockCount = response.$values.length;
        } else {
          this.lowStockCount = 0;
        }
      }
    });

    // Calcular valor total y productos activos
    this.productService.getProducts().pipe(
      catchError(error => {
        console.error('Error al cargar estadísticas:', error);
        return of({
          Items: { $values: [] },
          TotalCount: 0,
          PageNumber: 1,
          PageSize: 10,
          TotalPages: 1,
          HasPreviousPage: false,
          HasNextPage: false
        });
      })
    ).subscribe({
      next: (response) => {
        if (response && response.Items && response.Items.$values) {
          this.activeProducts = response.Items.$values.filter((p: any) => p.IsActive).length;
          this.totalValue = response.Items.$values.reduce((sum: number, p: any) => sum + (p.Price * p.CurrentStock), 0);
        } else {
          this.activeProducts = 0;
          this.totalValue = 0;
        }
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter.searchTerm = filterValue.trim().toLowerCase();
    this.loadProducts();
  }

  applyFilters() {
    // Categoría
    this.filter.categoryId = this.categorySelected.length > 0 ? this.categorySelected : undefined;
    // Rango de precios
    if (this.priceRangeSelected) {
      if (this.priceRangeSelected === '0-100') {
        this.filter.minPrice = 0;
        this.filter.maxPrice = 100;
      } else if (this.priceRangeSelected === '100-500') {
        this.filter.minPrice = 100;
        this.filter.maxPrice = 500;
      } else if (this.priceRangeSelected === '500+') {
        this.filter.minPrice = 500;
        this.filter.maxPrice = undefined;
      }
    } else {
      this.filter.minPrice = undefined;
      this.filter.maxPrice = undefined;
    }
    // Estado
    if (this.statusSelected && this.statusSelected !== 'all') {
      this.filter.isActive = this.statusSelected === 'active' ? true : false;
    } else {
      this.filter.isActive = undefined;
    }
    this.loadProducts();
  }

  onPageChange(event: any) {
    this.filter.page = event.pageIndex + 1;
    this.filter.pageSize = event.pageSize;
    this.loadProducts();
  }

  openProductDialog(product?: ProductDto) {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '800px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
        this.loadStatistics();
      }
    });
  }

  editProduct(product: ProductDto) {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '800px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
        this.loadStatistics();
        this.snackBar.open('Producto actualizado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['bg-green-600', 'text-white']
        });
      }
    });
  }

  deleteProduct(product: any) {
    // Asegurarse de capturar el id correctamente (Id o id)
    const id = product.id ?? product.Id;
    const name = product.name ?? product.Name;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.loadProducts();
            this.loadStatistics();
            this.snackBar.open(`Producto eliminado: ${name}`, 'Cerrar', {
              duration: 3000,
              panelClass: ['bg-green-600', 'text-white', 'font-semibold']
            });
          },
          error: (error) => {
            console.error('Error al eliminar producto:', error);
            this.snackBar.open('Error al eliminar producto', 'Cerrar', {
              duration: 3000,
              panelClass: ['bg-red-600', 'text-white']
            });
          }
        });
      }
    });
  }

  viewMovements(product: ProductDto) {
    this.productService.getProductMovements(product.id).subscribe({
      next: (movements) => {
        // TODO: Implementar vista de movimientos
        console.log('Movimientos:', movements);
      }
    });
  }

  viewPriceHistory(product: ProductDto) {
    this.productService.getPriceHistory(product.id).subscribe({
      next: (history) => {
        // TODO: Implementar vista de historial de precios
        console.log('Historial de precios:', history);
      }
    });
  }

  getStockClass(currentStock: number, minimumStock: number): string {
    if (currentStock <= 0) return 'stock-warning';
    if (currentStock <= minimumStock) return 'stock-warning';
    return 'stock-normal';
  }

  getStockColor(currentStock: number, minimumStock: number): string {
    if (currentStock <= 0) return 'warn';
    if (currentStock <= minimumStock) return 'accent';
    return 'primary';
  }
}

// Diálogo de confirmación
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="animate-fade-in">
      <mat-dialog-content class="flex flex-col items-center justify-center py-10 px-8">
        <div class="flex flex-col items-center mb-4">
          <mat-icon color="warn" style="font-size: 72px; margin-bottom: 18px; filter: drop-shadow(0 2px 8px #f87171cc);">warning_amber</mat-icon>
          <h2 class="text-2xl font-bold mb-2 text-center text-red-700">¿Eliminar producto?</h2>
          <p class="text-center mb-2 text-gray-700" style="max-width: 340px;">
            ¿Está seguro de que desea eliminar el producto <b class='text-red-600'>{{data.name}}</b>?<br>
            <span class="text-sm text-gray-500">Esta acción no se puede deshacer.</span>
          </p>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="center" class="pb-4">
        <button mat-stroked-button mat-dialog-close color="primary" class="mx-2 px-6 py-2 rounded-full transition hover:bg-blue-50">Cancelar</button>
        <button mat-raised-button color="warn" [mat-dialog-close]="true" class="mx-2 px-6 py-2 rounded-full font-semibold transition hover:bg-red-600 hover:text-white">Sí, eliminar</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string }, private snackBar: MatSnackBar) {}
} 