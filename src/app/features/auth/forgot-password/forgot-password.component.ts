import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CorporateModalComponent, ModalConfig } from '../../../shared/components/corporate-modal/corporate-modal.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CorporateModalComponent],
  template: `
    <app-corporate-modal
      [isOpen]="isOpen"
      [config]="modalConfig"
      (onClose)="close()"
      (onAction)="onAction($event)"
    >
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-6" autocomplete="off">
        <div>
          <label for="email" class="block text-sm font-medium text-slate-700 mb-2">Correo electrónico</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-base"
            placeholder="Ingresa tu correo"
            autocomplete="email"
            [class.border-red-500]="form.get('email')?.invalid && form.get('email')?.touched"
            required
            autofocus
          />
          <div *ngIf="form.get('email')?.invalid && form.get('email')?.touched" class="text-red-500 text-xs mt-1">
            {{ getErrorMessage() }}
          </div>
        </div>
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          [disabled]="form.invalid || loading"
        >
          <svg *ngIf="loading" class="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          <span>Enviar instrucciones</span>
        </button>
        <div *ngIf="success" class="text-green-600 text-center text-sm font-medium mt-2">
          Si el correo existe, recibirás instrucciones para restablecer tu contraseña.
        </div>
        <div *ngIf="error" class="text-red-500 text-center text-sm font-medium mt-2">
          {{ error }}
        </div>
      </form>
    </app-corporate-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {
  @Output() closed = new EventEmitter<void>();
  isOpen = true;
  form: FormGroup;
  loading = false;
  success = false;
  error: string | null = null;

  modalConfig: ModalConfig = {
    title: 'Recuperar contraseña',
    subtitle: 'Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.',
    size: 'sm',
    showCloseButton: true,
    showBackdrop: true,
    closeOnBackdropClick: true,
    showFooter: false
  };

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  getErrorMessage(): string {
    const control = this.form.get('email');
    if (control?.hasError('required')) return 'El correo es obligatorio';
    if (control?.hasError('email')) return 'Correo inválido';
    return '';
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    this.success = false;
    const email = this.form.value.email;
    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.form.reset();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.message || 'No se pudo procesar la solicitud.';
      }
    });
  }

  close() {
    this.isOpen = false;
    this.closed.emit();
  }

  onAction(action: string) {
    if (action === 'close') this.close();
  }
} 