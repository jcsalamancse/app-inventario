import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/users-list/users-list.component')
          .then(m => m.UsersListComponent),
        title: 'Usuarios'
      },
      {
        path: 'roles',
        loadComponent: () => import('./components/roles-list/roles-list.component')
          .then(m => m.RolesListComponent),
        title: 'Roles'
      }
    ]
  }
]; 