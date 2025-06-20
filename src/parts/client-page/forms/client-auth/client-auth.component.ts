import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '@/shared/services/auth.service';
import { NotificationService } from '@/shared/services/notification.service';
import { registrationFormInterface } from '@/shared/interfaces/auth-form.interface';

@Component({
  selector: 'app-client-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './client-auth.component.html',
  styleUrl: './client-auth.component.scss',
})
export class ClientAuthComponent {
  @Output() close = new EventEmitter<void>();

  private readonly authService = inject(AuthService);

  protected readonly isLogin = signal(true);

  protected readonly loginForm = this.getNewLoginFormGroup();
  protected readonly registrationForm = this.getNewRegistrationFormGroup();
  private notificationService = inject(NotificationService);

  protected login() {
    this.authService
      .login({
        email: this.loginForm.value.email || '',
        password: this.loginForm.value.password || '',
      })
      .pipe(
        finalize(() => {
          this.close.emit();
        })
      )
      .subscribe({
        next: (res: any) => {
          this.notificationService.success(
            res?.detail || 'Вход выполнен успешно'
          );
        },
        error: (err) => {
          this.notificationService.error(err?.error?.detail || 'Ошибка входа');
        },
      });
  }

  protected register() {
    this.authService
      .register({
        email: this.registrationForm.value.email || '',
        name: this.registrationForm.value.name || '',
        surname: this.registrationForm.value.surname || '',
        patronymic: this.registrationForm.value.patronymic || '',
        password: this.registrationForm.value.password || '',
      })
      .pipe(
        finalize(() => {
          this.close.emit();
        })
      )
      .subscribe({
        next: (res: any) => {
          this.notificationService.success(
            res?.detail || 'Регистрация прошла успешно'
          );
        },
        error: (err) => {
          this.notificationService.error(
            err?.error?.detail || 'Ошибка регистрации'
          );
        },
      });
  }

  protected goToLogin() {
    this.isLogin.set(true);
  }

  protected goToRegister() {
    this.isLogin.set(false);
  }

  private getNewLoginFormGroup() {
    return new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }
  private getNewRegistrationFormGroup() {
    return new FormGroup<registrationFormInterface>(
      {
        email: new FormControl<string>('', [
          Validators.email,
          Validators.required,
        ]),
        password: new FormControl('', [Validators.required]),
        repeatPassword: new FormControl('', [Validators.required]),
        surname: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
        patronymic: new FormControl('', []),
        acceptedAgreement: new FormControl(false, [Validators.requiredTrue]),
      },
      [this.passwordsMatchValidator]
    );
  }

  private passwordsMatchValidator(): (
    control: AbstractControl
  ) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('repeatPassword')?.value;

      return password === confirmPassword ? null : { mismatch: true };
    };
  }
}
