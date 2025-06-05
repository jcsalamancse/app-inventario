import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="bg-[#1a1a2e] text-white p-6 rounded-2xl shadow-2xl max-w-md mx-auto">
      <div class="flex items-center gap-3 mb-6">
        <div class="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-xl">
          <mat-icon fontIcon="lock" class="text-white text-2xl"></mat-icon>
        </div>
        <h2 class="text-2xl font-bold text-white">Cambiar Contraseña</h2>
      </div>
      
      <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm text-white/70">Contraseña Actual</label>
          <div class="relative">
            <input [type]="showCurrentPassword ? 'text' : 'password'" 
                   formControlName="currentPassword" 
                   required
                   class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-blue-500 transition-colors pr-10">
            <button type="button" 
                    (click)="showCurrentPassword = !showCurrentPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
              <mat-icon>{{ showCurrentPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </div>
          <div *ngIf="passwordForm.get('currentPassword')?.hasError('required') && passwordForm.get('currentPassword')?.touched"
               class="text-red-400 text-sm mt-1">
            La contraseña actual es requerida
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm text-white/70">Nueva Contraseña</label>
          <div class="relative">
            <input [type]="showNewPassword ? 'text' : 'password'" 
                   formControlName="newPassword" 
                   required
                   class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-blue-500 transition-colors pr-10">
            <button type="button" 
                    (click)="showNewPassword = !showNewPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
              <mat-icon>{{ showNewPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </div>
          <div *ngIf="passwordForm.get('newPassword')?.hasError('required') && passwordForm.get('newPassword')?.touched"
               class="text-red-400 text-sm mt-1">
            La nueva contraseña es requerida
          </div>
          <div *ngIf="passwordForm.get('newPassword')?.hasError('minlength') && passwordForm.get('newPassword')?.touched"
               class="text-red-400 text-sm mt-1">
            La contraseña debe tener al menos 6 caracteres
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm text-white/70">Confirmar Nueva Contraseña</label>
          <div class="relative">
            <input [type]="showConfirmPassword ? 'text' : 'password'" 
                   formControlName="confirmPassword" 
                   required
                   class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/50 focus:outline-none focus:border-blue-500 transition-colors pr-10">
            <button type="button" 
                    (click)="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
              <mat-icon>{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </div>
          <div *ngIf="passwordForm.get('confirmPassword')?.hasError('required') && passwordForm.get('confirmPassword')?.touched"
               class="text-red-400 text-sm mt-1">
            La confirmación de contraseña es requerida
          </div>
          <div *ngIf="passwordForm.get('confirmPassword')?.hasError('passwordMismatch') && passwordForm.get('confirmPassword')?.touched"
               class="text-red-400 text-sm mt-1">
            Las contraseñas no coinciden
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button type="button" (click)="onCancel()"
                  class="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            Cancelar
          </button>
          <button type="submit" [disabled]="passwordForm.invalid || loading"
                  class="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:from-blue-600 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2">
            <mat-icon *ngIf="loading" class="animate-spin">refresh</mat-icon>
            {{ loading ? 'Cambiando...' : 'Cambiar Contraseña' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    ::ng-deep .mat-mdc-dialog-container {
      --mdc-dialog-container-color: transparent;
    }
  `]
})
export class ChangePasswordDialogComponent {
  passwordForm: FormGroup;
  loading = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  showResultDialog(success: boolean) {
    const dialogRef = this.dialog.open(PasswordChangeResultDialog, {
      data: { success },
      width: '400px',
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(() => {
      if (success) {
        this.dialogRef.close(true);
      }
    });
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.loading = true;
      this.authService.changePassword(this.passwordForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.showResultDialog(true);
        },
        error: (error) => {
          console.error('Error al cambiar la contraseña:', error);
          this.loading = false;
          this.showResultDialog(false);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-password-change-result-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="bg-[#1a1a2e] text-white p-6 rounded-2xl shadow-2xl max-w-sm mx-auto">
      <div class="flex flex-col items-center text-center">
        <div class="mb-4" [class]="data.success ? 'bg-green-500/20' : 'bg-red-500/20'">
          <mat-icon [fontIcon]="data.success ? 'check_circle' : 'error'" 
                   [class]="data.success ? 'text-green-400' : 'text-red-400'"
                   class="text-5xl"></mat-icon>
        </div>
        <h2 class="text-xl font-bold mb-2">
          {{ data.success ? '¡Contraseña Cambiada!' : 'Error al Cambiar Contraseña' }}
        </h2>
        <p class="text-white/70 mb-6">
          {{ data.success ? 'Tu contraseña ha sido actualizada exitosamente.' : 'No se pudo cambiar la contraseña. Por favor, intenta nuevamente.' }}
        </p>
        <button mat-button (click)="dialogRef.close()"
                [class]="data.success ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'"
                class="px-6 py-2 rounded-lg transition-colors">
          {{ data.success ? 'Continuar' : 'Intentar de nuevo' }}
        </button>
      </div>
    </div>
  `
})
export class PasswordChangeResultDialog {
  constructor(
    public dialogRef: MatDialogRef<PasswordChangeResultDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { success: boolean }
  ) {}
} 