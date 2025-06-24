import { UserFormData } from '@/manager-page/interfaces/user-form.interface';
import { AuthService } from '@/shared/services/auth.service';
import { NotificationService } from '@/shared/services/notification.service';
import { UsersService } from '@/shared/services/users.service';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

type FormControlsOf<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

@Component({
  selector: 'app-user-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
})
export class UserEditComponent {
  user = signal<any>(null);
  userId!: number;

  userForm = new FormGroup<FormControlsOf<UserFormData>>({
    surname: new FormControl(''),
    name: new FormControl(''),
    patronymic: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    role: new FormControl('client'),
    city: new FormControl(''),
    street: new FormControl(''),
    house: new FormControl(''),
    septicModel: new FormControl(''),
    septicVolume: new FormControl(null),
  });

  private readonly usersService = inject(UsersService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.userId = +this.route.snapshot.params['id'];
    this.loadUserById(this.userId);

    this.authService.getSessionData().subscribe({
      next: (data) => {
        this.user.set(data?.user);
      },
    });
  }

  loadUserById(id: number): void {
    this.usersService.getUserById(id).subscribe({
      next: (data: any) => {
        const septic = data.septic || {};

        this.userForm.patchValue({
          surname: data.user.surname || '',
          name: data.user.name || '',
          patronymic: data.user.patronymic || '',
          email: data.user.email || '',
          phone: data.user.phone_number || '',
          role: data.user.role || 'client',
          city: septic.city || '',
          street: septic.street || '',
          house: septic.house || '',
          septicModel: septic.model || '',
          septicVolume: septic.volume || null,
        });
      },
      error: (err: any) => {
        this.notificationService.error(
          `Ошибка при получении пользователя с id ${id}: ${
            err?.error?.detail || 'Неизвестная ошибка'
          }`
        );
      },
    });
  }

  onSave(): void {
    if (this.userForm.invalid) return;

    const formData = this.userForm.getRawValue();

    const client = {
      name: formData.name || '',
      surname: formData.surname || '',
      patronymic: formData.patronymic || '',
      email: formData.email || '',
      phone_number: formData.phone || '',
    };

    const septic = {
      city: formData.city || '',
      street: formData.street || '',
      house: formData.house || '',
      volume: formData.septicVolume || 0,
      model: formData.septicModel || '',
    };

    const isAdmin = this.user()?.role === 'admin';

    const payload = isAdmin
      ? {
          client,
          septic,
          new_role: formData.role || 'client',
        }
      : {
          client,
          septic,
        };

    const save$ = isAdmin
      ? this.usersService.updateUserAndRole(this.userId, payload)
      : this.usersService.updateUserFull(this.userId, payload);

    save$.subscribe({
      next: () => {
        this.notificationService.success('Пользователь успешно обновлён');
      },
      error: (err) => {
        this.notificationService.error(
          `Ошибка при обновлении пользователя: ${
            err?.error?.detail || 'Неизвестная ошибка'
          }`
        );
      },
    });
  }
}
