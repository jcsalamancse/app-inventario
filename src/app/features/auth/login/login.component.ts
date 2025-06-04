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
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { login } from '../../../store/actions/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../../store/selectors/auth.selectors';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  hidePassword = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private store: Store
  ) {
    let rememberedUser = '';
    if (isPlatformBrowser(this.platformId)) {
      rememberedUser = localStorage.getItem('rememberedUser') || '';
    }
    this.loginForm = this.fb.group({
      username: [rememberedUser, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [!!rememberedUser]
    });

    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);

    // Escuchar cambios en el campo username y rememberMe para actualizar localStorage en tiempo real
    this.loginForm.get('rememberMe')?.valueChanges.subscribe(checked => {
      const username = this.loginForm.get('username')?.value;
      if (isPlatformBrowser(this.platformId)) {
        if (checked && username) {
          localStorage.setItem('rememberedUser', username);
        } else if (!checked) {
          localStorage.removeItem('rememberedUser');
        }
      }
    });
    this.loginForm.get('username')?.valueChanges.subscribe(username => {
      const checked = this.loginForm.get('rememberMe')?.value;
      if (isPlatformBrowser(this.platformId)) {
        if (checked && username) {
          localStorage.setItem('rememberedUser', username);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password, rememberMe } = this.loginForm.value;
      if (isPlatformBrowser(this.platformId)) {
        if (rememberMe && username) {
          localStorage.setItem('rememberedUser', username);
        } else if (!rememberMe) {
          localStorage.removeItem('rememberedUser');
        }
      }
      this.store.dispatch(login({ username, password }));
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
}
