import { Component, inject } from '@angular/core';
import { UsersService } from '@/shared/services/users.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserFormData } from '@/manager-page/interfaces/user-form.interface';

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
  user: any = null;

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

  private usersService = inject(UsersService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const userId = this.route.snapshot.params['id'];
    this.loadUserById(userId);
  }

  loadUserById(id: number): void {
    this.usersService.getUserById(id).subscribe({
      next: (data: any) => {
        this.user = data;
        this.userForm.patchValue({
          surname: data.surname || '',
          name: data.name || '',
          patronymic: data.patronymic || '',
          email: data.email || '',
          phone: data.phone_number || '',
          role: data.role || 'client',
          city: data.city || '',
          street: data.street || '',
          house: data.house || '',
          septicModel: data.septicModel || '',
          septicVolume: data.septicVolume || null,
        });
      },
      error: (err: any) => {
        console.error(`Ошибка при получении пользователя с id ${id}`, err);
      },
    });
  }

  onSave(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.getRawValue();
      console.log('Отправка данных:', formData);
    }
  }
}
