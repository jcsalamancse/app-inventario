import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionListComponent } from './components/permission-list/permission-list.component';
import { PermissionFormComponent } from './components/permission-form/permission-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';

const routes: Routes = [
  {
    path: '',
    component: PermissionListComponent
  },
  {
    path: 'new',
    component: PermissionFormComponent
  },
  {
    path: 'edit/:id',
    component: PermissionFormComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatTreeModule,
    MatCheckboxModule,
    RouterModule.forChild(routes),
    PermissionListComponent,
    PermissionFormComponent
  ],
  exports: [
    RouterModule,
    PermissionListComponent,
    PermissionFormComponent
  ]
})
export class PermissionsModule { }
 