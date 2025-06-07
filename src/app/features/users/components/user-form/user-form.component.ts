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
        <mat-form-field class="w-full">
          <mat-label>Nombre de Usuario</mat-label>
          <input matInput formControlName="UserName" required>
          <mat-error *ngIf="userForm.get('UserName')?.hasError('required')">
            El nombre de usuario es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="FirstName" required>
          <mat-error *ngIf="userForm.get('FirstName')?.hasError('required')">
            El nombre es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Apellido</mat-label>
          <input matInput formControlName="LastName" required>
          <mat-error *ngIf="userForm.get('LastName')?.hasError('required')">
            El apellido es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Email</mat-label>
          <input matInput formControlName="Email" type="email" required>
          <mat-error *ngIf="userForm.get('Email')?.hasError('required')">
            El email es requerido
          </mat-error>
          <mat-error *ngIf="userForm.get('Email')?.hasError('email')">
            Ingrese un email válido
          </mat-error>
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Rol</mat-label>
          <mat-select formControlName="RoleId" required>
            <mat-option [value]="1">Administrador</mat-option>
            <mat-option [value]="2">Usuario</mat-option>
          </mat-select>
          <mat-error *ngIf="userForm.get('RoleId')?.hasError('required')">
            El rol es requerido
          </mat-error>
        </mat-form-field>

        <div *ngIf="!data" class="space-y-4">
          <mat-form-field class="w-full">
            <mat-label>Contraseña</mat-label>
            <input matInput formControlName="Password" type="password" required>
            <mat-error *ngIf="userForm.get('Password')?.hasError('required')">
              La contraseña es requerida
            </mat-error>
            <mat-error *ngIf="userForm.get('Password')?.hasError('minlength')">
              La contraseña debe tener al menos 6 caracteres
            </mat-error>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Confirmar Contraseña</mat-label>
            <input matInput formControlName="ConfirmPassword" type="password" required>
            <mat-error *ngIf="userForm.get('ConfirmPassword')?.hasError('required')">
              La confirmación de contraseña es requerida
            </mat-error>
            <mat-error *ngIf="userForm.get('ConfirmPassword')?.hasError('passwordMismatch')">
              Las contraseñas no coinciden
            </mat-error>
          </mat-form-field>
        </div>

        <mat-form-field class="w-full" *ngIf="data">
          <mat-label>Nueva Contraseña</mat-label>
          <input matInput formControlName="NewPassword" type="password">
          <mat-hint>Déjalo vacío si no deseas cambiar la contraseña</mat-hint>
        </mat-form-field>

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
      UserName: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      RoleId: [2, Validators.required],
      Password: ['', [!data ? Validators.required : Validators.nullValidator, Validators.minLength(6)]],
      ConfirmPassword: ['', !data ? Validators.required : Validators.nullValidator],
      NewPassword: ['']
    }, { validator: this.passwordMatchValidator });

    if (data) {
      this.userForm.patchValue({
        UserName: data.UserName,
        FirstName: data.FirstName,
        LastName: data.LastName,
        Email: data.Email,
        RoleId: data.RoleId
      });
      this.userForm.get('Password')?.clearValidators();
      this.userForm.get('ConfirmPassword')?.clearValidators();
    }
  }

  ngOnInit(): void {}

  passwordMatchValidator(g: FormGroup) {
    return g.get('Password')?.value === g.get('ConfirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      
      if (this.data) {
        const updateObj: any = {
          UserName: formValue.UserName,
          FirstName: formValue.FirstName,
          LastName: formValue.LastName,
          Email: formValue.Email,
          RoleId: formValue.RoleId
        };
        if (formValue.NewPassword) {
          updateObj.Password = formValue.NewPassword;
        }

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
          UserName: formValue.UserName,
          FirstName: formValue.FirstName,
          LastName: formValue.LastName,
          Email: formValue.Email,
          RoleId: formValue.RoleId,
          Password: formValue.Password
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