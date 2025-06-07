import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { User, UserCreateDto, UserUpdateDto } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">{{data ? 'Editar' : 'Crear'}} Usuario</h2>
      
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <mat-form-field class="w-full" *ngIf="!data">
          <mat-label>Nombre de Usuario</mat-label>
          <input matInput formControlName="userName" required>
          <mat-error *ngIf="userForm.get('userName')?.hasError('required')">
            El nombre de usuario es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="firstName" required>
          <mat-error *ngIf="userForm.get('firstName')?.hasError('required')">
            El nombre es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Apellido</mat-label>
          <input matInput formControlName="lastName" required>
          <mat-error *ngIf="userForm.get('lastName')?.hasError('required')">
            El apellido es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" required>
          <mat-error *ngIf="userForm.get('email')?.hasError('required')">
            El email es requerido
          </mat-error>
          <mat-error *ngIf="userForm.get('email')?.hasError('email')">
            Ingrese un email válido
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Rol</mat-label>
          <mat-select formControlName="roleId" required>
            <mat-option [value]="1">Administrador</mat-option>
            <mat-option [value]="2">Usuario</mat-option>
          </mat-select>
          <mat-error *ngIf="userForm.get('roleId')?.hasError('required')">
            El rol es requerido
          </mat-error>
        </mat-form-field>

        <div *ngIf="!data" class="space-y-4">
          <mat-form-field class="w-full">
            <mat-label>Contraseña</mat-label>
            <input matInput formControlName="password" type="password" required>
            <mat-error *ngIf="userForm.get('password')?.hasError('required')">
              La contraseña es requerida
            </mat-error>
            <mat-error *ngIf="userForm.get('password')?.hasError('minlength')">
              La contraseña debe tener al menos 6 caracteres
            </mat-error>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Confirmar Contraseña</mat-label>
            <input matInput formControlName="confirmPassword" type="password" required>
            <mat-error *ngIf="userForm.get('confirmPassword')?.hasError('required')">
              La confirmación de contraseña es requerida
            </mat-error>
            <mat-error *ngIf="userForm.get('confirmPassword')?.hasError('passwordMismatch')">
              Las contraseñas no coinciden
            </mat-error>
          </mat-form-field>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button 
            mat-button 
            type="button" 
            (click)="onCancel()">
            Cancelar
          </button>
          <button 
            mat-raised-button 
            color="primary" 
            type="submit"
            [disabled]="userForm.invalid">
            {{data ? 'Actualizar' : 'Crear'}}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roleId: [2, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    if (data) {
      this.userForm.patchValue({
        FirstName: data.FirstName,
        LastName: data.LastName,
        Email: data.Email,
        RoleId: data.RoleId
      });
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('confirmPassword')?.clearValidators();
      this.userForm.get('userName')?.clearValidators();
    }
  }

  ngOnInit(): void {}

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      
      if (this.data) {
        const updateObj: Partial<User> = {
          FirstName: formValue.FirstName,
          LastName: formValue.LastName,
          Email: formValue.Email,
          RoleId: formValue.RoleId
        };

        this.userService.updateUser(this.data.Id, updateObj).subscribe({
          next: () => {
            this.snackBar.open('Usuario actualizado exitosamente', 'Cerrar', {
              duration: 3000
            });
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            this.snackBar.open('Error al actualizar usuario', 'Cerrar', {
              duration: 3000
            });
            console.error('Error updating user:', error);
          }
        });
      } else {
        const createObj: any = {
          UserName: formValue.userName,
          FirstName: formValue.firstName,
          LastName: formValue.lastName,
          Email: formValue.email,
          RoleId: formValue.roleId,
          Password: formValue.password
        };

        this.userService.createUser(createObj).subscribe({
          next: () => {
            this.snackBar.open('Usuario creado exitosamente', 'Cerrar', {
              duration: 3000
            });
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            this.snackBar.open('Error al crear usuario', 'Cerrar', {
              duration: 3000
            });
            console.error('Error creating user:', error);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 