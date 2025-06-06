import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="p-6">
      <h2 mat-dialog-title>{{ data ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <div class="grid grid-cols-2 gap-4">
            <mat-form-field appearance="fill">
              <mat-label>Nombre de Usuario</mat-label>
              <input matInput formControlName="userName" placeholder="Usuario">
              <mat-error *ngIf="userForm.get('userName')?.hasError('required')">
                El nombre de usuario es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Email">
              <mat-error *ngIf="userForm.get('email')?.hasError('required')">
                El email es requerido
              </mat-error>
              <mat-error *ngIf="userForm.get('email')?.hasError('email')">
                Email inválido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="firstName" placeholder="Nombre">
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Apellido</mat-label>
              <input matInput formControlName="lastName" placeholder="Apellido">
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Rol</mat-label>
              <mat-select formControlName="roleId">
                <mat-option *ngFor="let role of roles" [value]="role.id">
                  {{role.name}}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="userForm.get('roleId')?.hasError('required')">
                El rol es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" *ngIf="!data">
              <mat-label>Contraseña</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="userForm.get('password')?.hasError('required')">
                La contraseña es requerida
              </mat-error>
              <mat-error *ngIf="userForm.get('password')?.hasError('minlength')">
                La contraseña debe tener al menos 6 caracteres
              </mat-error>
            </mat-form-field>
          </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button type="button" (click)="onCancel()">Cancelar</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="userForm.invalid">
            {{ data ? 'Actualizar' : 'Crear' }}
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class UserFormComponent {
  userForm: FormGroup;
  hidePassword = true;
  roles = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Usuario' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: User
  ) {
    this.userForm = this.fb.group({
      userName: [data?.userName || '', [Validators.required]],
      email: [data?.email || '', [Validators.required, Validators.email]],
      firstName: [data?.firstName || ''],
      lastName: [data?.lastName || ''],
      roleId: [data?.roleId || '', [Validators.required]],
      password: ['', data ? [] : [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      if (this.data) {
        this.userService.updateUser(this.data.id, userData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (error) => console.error('Error al actualizar usuario', error)
        });
      } else {
        this.userService.createUser(userData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (error) => console.error('Error al crear usuario', error)
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 