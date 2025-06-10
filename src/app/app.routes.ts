import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { USERS_ROUTES } from './features/users/users.routes';
import { CATEGORIES_ROUTES } from './features/categories/categories.routes';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      {
        path: 'users',
        children: USERS_ROUTES
      },
      {
        path: 'categories',
        children: CATEGORIES_ROUTES
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/components/products-list/products-list.component').then(m => m.ProductsListComponent)
      },
      {
        path: 'roles',
        loadComponent: () => import('./features/roles/components/roles-list/roles-list.component').then(m => m.RolesListComponent)
      },
      {
        path: 'permissions',
        loadChildren: () => import('./features/permissions/permissions.module').then(m => m.PermissionsModule)
      },
      {
        path: 'movimientos',
        loadComponent: () => import('./features/movements/components/movement-list.component').then(m => m.MovementListComponent)
      }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
