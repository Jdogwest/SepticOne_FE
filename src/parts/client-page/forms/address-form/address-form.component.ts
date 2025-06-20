import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddressFormData } from '@/shared/interfaces/address-form.interface';
import { AuthService } from '@/shared/services/auth.service';
import { SepticService } from '@/shared/services/septic.service';
import { NotificationService } from '@/shared/services/notification.service';

type FormControlsOf<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

@Component({
  selector: 'app-address-form',
  imports: [ReactiveFormsModule],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
})
export class AddressFormComponent {
  private readonly authService = inject(AuthService);

  private readonly septicService = inject(SepticService);

  protected readonly isEdit = signal(false);

  readonly isLoggedIn = signal(false);

  private notificationService = inject(NotificationService);

  addressForm = new FormGroup<FormControlsOf<AddressFormData>>({
    city: new FormControl<string>(''),
    street: new FormControl<string>(''),
    house: new FormControl<string>(''),
    septicModel: new FormControl<string>(''),
    septicVolume: new FormControl<number | null>(null),
  });

  ngOnInit() {
    this.authService.getSessionData().subscribe((session) => {
      if (!session) return;

      const septic = session.septic;

      if (septic) {
        this.addressForm.patchValue({
          city: septic.city,
          street: septic.street,
          house: septic.house,
          septicModel: septic.model,
          septicVolume: septic.volume,
        });
      }

      this.addressForm.disable();
      this.isLoggedIn.set(true);
    });
  }

  enableEdit() {
    this.isEdit.set(true);
    this.addressForm.enable();
  }

  disableEdit() {
    this.isEdit.set(false);
    this.addressForm.disable();
  }

  onSubmit() {
    if (this.addressForm.valid) {
      const formData = this.addressForm.value;

      const body = {
        city: formData.city!,
        street: formData.street!,
        house: formData.house!,
        model: formData.septicModel!,
        volume: formData.septicVolume!,
      };

      this.septicService.editSeptic(body).subscribe({
        next: (res: any) => {
          this.notificationService.success(
            res?.detail || 'Септик успешно обновлён'
          );
          this.disableEdit();
        },
        error: (err) => {
          this.notificationService.error(
            err?.error?.detail || 'Ошибка обновления септика'
          );
        },
      });
    }
  }
}
