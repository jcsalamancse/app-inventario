import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CorporateModalComponent, ModalConfig } from '../../../shared/components/corporate-modal/corporate-modal.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CorporateModalComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#13131f] to-[#1c1c2c]">
      <div class="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl animate-fade-in">
        <h2 class="text-center text-2xl font-bold text-white mb-2">Restablecer contraseña</h2>
        <p class="text-center text-purple-300 mb-6">Ingresa tu nueva contraseña</p>
        <form *ngIf="!success" [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-6" autocomplete="off">
          <div>
            <label for="newPassword" class="block text-sm font-medium text-slate-700 mb-2">Nueva contraseña</label>
            <input
              id="newPassword"
              type="password"
              formControlName="newPassword"
              class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-base"
              placeholder="Nueva contraseña"
              autocomplete="new-password"
              [class.border-red-500]="form.get('newPassword')?.invalid && form.get('newPassword')?.touched"
              required
            />
            <div *ngIf="form.get('newPassword')?.invalid && form.get('newPassword')?.touched" class="text-red-500 text-xs mt-1">
              {{ getErrorMessage() }}
            </div>
          </div>
          <button
            type="submit"
            class="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            [disabled]="form.invalid || loading"
          >
            <svg *ngIf="loading" class="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            <span>Restablecer contraseña</span>
          </button>
          <div *ngIf="error" class="text-red-500 text-center text-sm font-medium mt-2">
            {{ error }}
          </div>
        </form>
        <app-corporate-modal
          *ngIf="success"
          [isOpen]="success"
          [config]="modalConfig"
          (onClose)="onSuccessModalClose()"
          (onAction)="onSuccessModalAction($event)"
        >
          <div class="text-green-700 text-center text-base font-medium py-4">
            {{ successMessage || '¡Contraseña restablecida correctamente!' }}
          </div>
        </app-corporate-modal>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
  form: FormGroup;
  loading = false;
  success = false;
  error: string | null = null;
  token: string = '';
  successMessage: string = '';
  modalConfig: ModalConfig = {
    title: 'Contraseña restablecida',
    subtitle: '',
    size: 'sm',
    showCloseButton: true,
    showBackdrop: true,
    closeOnBackdropClick: false,
    showFooter: true,
    footerButtons: [
      {
        text: 'Aceptar',
        type: 'primary',
        action: 'accept',
        disabled: false
      }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  getErrorMessage(): string {
    const control = this.form.get('newPassword');
    if (control?.hasError('required')) return 'La contraseña es obligatoria';
    if (control?.hasError('minlength')) return 'Debe tener al menos 6 caracteres';
    return '';
  }

  onSubmit() {
    if (this.form.invalid || !this.token) {
      this.error = !this.token ? 'Token inválido o expirado.' : '';
      return;
    }
    this.loading = true;
    this.error = null;
    this.success = false;
    const newPassword = this.form.value.newPassword;
    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = true;
        this.successMessage = res?.message || '¡Contraseña restablecida correctamente!';
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.message || 'No se pudo restablecer la contraseña.';
        this.cdr.markForCheck();
      }
    });
  }

  onSuccessModalClose() {
    this.success = false;
    this.router.navigate(['/login']);
  }

  onSuccessModalAction(action: string) {
    if (action === 'accept') {
      this.onSuccessModalClose();
    }
  }
} 