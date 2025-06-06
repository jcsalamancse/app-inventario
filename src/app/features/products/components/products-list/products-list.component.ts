import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable } from '@angular/material/table';
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
import { RouterModule } from '@angular/router';
import { ProductService, Product, ProductFilter } from '../../services/product.service';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
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
    RouterModule
  ],
  template: `
    <div class="bg-white rounded-xl shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Productos</h2>
        <button mat-raised-button color="primary" (click)="openProductDialog()">
          <mat-icon>add</mat-icon>
          Nuevo Producto
        </button>
      </div>
      <table mat-table [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let row">{{row.id}}</td>
        </ng-container>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nombre</th>
          <td mat-cell *matCellDef="let row">{{row.name}}</td>
        </ng-container>
        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef>Precio</th>
          <td mat-cell *matCellDef="let row">{{row.price | currency}}</td>
        </ng-container>
        <ng-container matColumnDef="stock">
          <th mat-header-cell *matHeaderCellDef>Stock</th>
          <td mat-cell *matCellDef="let row">{{row.stock}}</td>
        </ng-container>
        <ng-container matColumnDef="categoryId">
          <th mat-header-cell *matHeaderCellDef>Categoría</th>
          <td mat-cell *matCellDef="let row">{{row.categoryId}}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Estado</th>
          <td mat-cell *matCellDef="let row">
            <mat-chip-listbox>
              <mat-chip [color]="row.status === 'active' ? 'primary' : 'warn'" selected>
                {{row.status}}
              </mat-chip>
            </mat-chip-listbox>
          </td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Acciones</th>
          <td mat-cell *matCellDef="let row">
            <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Menu de acciones">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="editProduct(row)">
                <mat-icon>edit</mat-icon>
                <span>Editar</span>
              </button>
              <button mat-menu-item (click)="deleteProduct(row)">
                <mat-icon>delete</mat-icon>
                <span>Eliminar</span>
              </button>
              <button mat-menu-item (click)="viewMovements(row)">
                <mat-icon>history</mat-icon>
                <span>Ver Movimientos</span>
              </button>
            </mat-menu>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Seleccionar página de productos"></mat-paginator>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .filter-field {
      width: 100%;
      margin-bottom: 20px;
    }
    .table-container {
      overflow: auto;
    }
    table {
      width: 100%;
    }
    .mat-column-actions {
      width: 120px;
      text-align: center;
    }
  `]
})
export class ProductsListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'price', 'stock', 'categoryId', 'status', 'actions'];
  dataSource: any;
  filter: ProductFilter = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Product>;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts(this.filter).subscribe({
      next: (response) => {
        this.dataSource = response;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.snackBar.open('Error al cargar productos', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter.searchTerm = filterValue.trim().toLowerCase();
    this.loadProducts();
  }

  openProductDialog(product?: Product) {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '600px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  editProduct(product: Product) {
    this.openProductDialog(product);
  }

  deleteProduct(product: Product) {
    if (confirm(`¿Está seguro de eliminar el producto ${product.name}?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.loadProducts();
          this.snackBar.open('Producto eliminado exitosamente', 'Cerrar', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error al eliminar producto:', error);
          this.snackBar.open('Error al eliminar producto', 'Cerrar', {
            duration: 3000
          });
        }
      });
    }
  }

  viewMovements(product: Product) {
    // TODO: Implementar vista de movimientos
    console.log('Ver movimientos del producto:', product.id);
  }
} 