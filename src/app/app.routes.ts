import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { USERS_ROUTES } from './features/users/users.routes';
import { CATEGORIES_ROUTES } from './features/categories/categories.routes';
import { NotFoundComponent } from './features/dashboard/components/not-found.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard],
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
        loadComponent: () => import('./features/products/components/products-list/products-list.component')
          .then(m => m.ProductsListComponent)
      },
      {
        path: 'roles',
        loadComponent: () => import('./features/roles/components/roles-list/roles-list.component')
          .then(m => m.RolesListComponent)
      },
      {
        path: 'permissions',
        loadChildren: () => import('./features/permissions/permissions.module')
          .then(m => m.PermissionsModule)
      },
      {
        path: 'movimientos',
        loadComponent: () => import('./features/movements/components/movement-list.component')
          .then(m => m.MovementListComponent)
      },
      {
        path: 'reportes',
        loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/dashboard/components/dashboard-home.component')
          .then(m => m.DashboardHomeComponent)
      }
    ]
  },
  { path: 'reset-password', loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];
