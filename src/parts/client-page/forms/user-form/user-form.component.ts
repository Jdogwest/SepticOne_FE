import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserFormData } from '@/shared/interfaces/user-form.interface';
import { AuthService } from '@/shared/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { UsersService } from '@/shared/services/users.service';
import { NotificationService } from '@/shared/services/notification.service';

type FormControlsOf<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  private readonly authService = inject(AuthService);

  private readonly usersService = inject(UsersService);

  private readonly destroyRef = inject(DestroyRef);

  protected readonly isEdit = signal(false);

  private notificationService = inject(NotificationService);

  userForm = new FormGroup<FormControlsOf<UserFormData>>({
    surname: new FormControl<string>(''),
    name: new FormControl<string>(''),
    patronymic: new FormControl<string>(''),
    email: new FormControl<string>(''),
    phone_number: new FormControl<string>(''),
  });

  ngOnInit() {
    this.userForm.disable();
    this.authService
      .getSessionData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const user = res?.user;
          if (user) {
            this.userForm.patchValue({
              name: user.name || '',
              surname: user.surname || '',
              patronymic: user.patronymic || '',
              email: user.email || '',
              phone_number: user.phone_number || '',
            });
          }
        },
        error: (err) => {
          console.error('Ошибка при получении данных пользователя:', err);
        },
      });
  }

  enableEdit() {
    this.isEdit.set(true);
    this.userForm.enable();
  }

  disableEdit() {
    this.isEdit.set(false);
    this.userForm.disable();
  }

  onSubmit() {
    if (this.userForm.valid) {
      const rawValue = this.userForm.value;

      const userData: UserFormData = {
        surname: rawValue.surname ?? null,
        name: rawValue.name ?? null,
        patronymic: rawValue.patronymic ?? null,
        email: rawValue.email ?? null,
        phone_number:
          rawValue.phone_number === undefined ||
          rawValue.phone_number?.trim() === ''
            ? null
            : rawValue.phone_number,
      };

      this.usersService.editUser(userData).subscribe({
        next: (res) => {
          this.notificationService.success(
            res?.detail || 'Данные пользователя успешно обновлены'
          );
          this.isEdit.set(false);
          this.disableEdit();
        },
        error: (err) => {
          this.notificationService.error(
            err?.error?.detail || JSON.stringify(err) || 'Ошибка редактирования'
          );
        },
      });
    }
  }
}
