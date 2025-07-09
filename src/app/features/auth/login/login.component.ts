import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSnackBarModule,
    ForgotPasswordComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;
  hidePassword = true;
  showForgotPasswordModal = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    let rememberedUser = '';
    if (isPlatformBrowser(this.platformId)) {
      try {
        rememberedUser = localStorage.getItem('rememberedUser') || '';
      } catch (error) {
        console.warn('Error accessing localStorage:', error);
      }
    }
    
    this.loginForm = this.fb.group({
      username: [rememberedUser, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [!!rememberedUser]
    });

    // Escuchar cambios en el campo username y rememberMe para actualizar localStorage en tiempo real
    this.loginForm.get('rememberMe')?.valueChanges.subscribe(checked => {
      const username = this.loginForm.get('username')?.value;
      if (isPlatformBrowser(this.platformId)) {
        try {
          if (checked && username) {
            localStorage.setItem('rememberedUser', username);
          } else if (!checked) {
            localStorage.removeItem('rememberedUser');
          }
        } catch (error) {
          console.warn('Error accessing localStorage:', error);
        }
      }
    });
    
    this.loginForm.get('username')?.valueChanges.subscribe(username => {
      const checked = this.loginForm.get('rememberMe')?.value;
      if (isPlatformBrowser(this.platformId)) {
        try {
          if (checked && username) {
            localStorage.setItem('rememberedUser', username);
          }
        } catch (error) {
          console.warn('Error accessing localStorage:', error);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = null;
      const { username, password, rememberMe } = this.loginForm.value;
      if (isPlatformBrowser(this.platformId)) {
        try {
          if (rememberMe && username) {
            localStorage.setItem('rememberedUser', username);
          } else if (!rememberMe) {
            localStorage.removeItem('rememberedUser');
          }
        } catch (error) {
          console.warn('Error accessing localStorage:', error);
        }
      }
      this.authService.login(username, password).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          this.loading = false;
          this.error = err?.message || 'No se pudo conectar con el API';
        }
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (controlName === 'username' && control?.hasError('email')) {
      return 'Usuario inválido';
    }
    if (control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }

  openForgotPasswordModal() {
    this.showForgotPasswordModal = true;
  }

  onForgotPasswordClosed() {
    this.showForgotPasswordModal = false;
  }
}
