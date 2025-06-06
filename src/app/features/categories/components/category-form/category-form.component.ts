import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule
  ],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">{{data ? 'Editar' : 'Nueva'}} Categoría</h2>
      
      <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
        <mat-form-field class="w-full mb-4">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" placeholder="Ingrese el nombre de la categoría">
          <mat-error *ngIf="categoryForm.get('name')?.hasError('required')">
            El nombre es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-full mb-4">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="description" rows="3" 
                    placeholder="Ingrese la descripción de la categoría"></textarea>
        </mat-form-field>

        <mat-checkbox formControlName="isActive" class="mb-4">
          Categoría Activa
        </mat-checkbox>

        <div class="flex justify-end gap-2">
          <button mat-button type="button" (click)="onCancel()">Cancelar</button>
          <button mat-raised-button color="primary" type="submit" 
                  [disabled]="categoryForm.invalid">
            {{data ? 'Actualizar' : 'Crear'}}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.categoryForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      
      if (this.data) {
        this.categoryService.updateCategory(this.data.id, categoryData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (error) => console.error('Error al actualizar categoría', error)
        });
      } else {
        this.categoryService.createCategory(categoryData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (error) => console.error('Error al crear categoría', error)
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 