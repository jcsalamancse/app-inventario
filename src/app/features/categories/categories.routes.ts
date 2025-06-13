import { Routes } from '@angular/router';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/categories-list/categories-list.component')
      .then(m => m.CategoriesListComponent),
    title: 'Categorías'
  },
  {
    path: 'nueva',
    loadComponent: () => import('./components/category-form/category-form.component')
      .then(m => m.CategoryFormComponent),
    title: 'Nueva Categoría'
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./components/category-form/category-form.component')
      .then(m => m.CategoryFormComponent),
    title: 'Editar Categoría'
  }
]; 