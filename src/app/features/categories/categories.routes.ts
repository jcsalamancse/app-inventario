import { Routes } from '@angular/router';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/categories-list/categories-list.component')
      .then(m => m.CategoriesListComponent),
    title: 'Categorías'
  }
]; 