import { ContactFormData } from '@/main-page/interfaces/contact.interface';
import { CallRequestsService } from '@/shared/services/call-requests.service';
import { NotificationService } from '@/shared/services/notification.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

type FormControlsOf<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent {
  private readonly callRequestsService = inject(CallRequestsService);

  private notificationService = inject(NotificationService);

  contactForm = new FormGroup<FormControlsOf<ContactFormData>>({
    fio: new FormControl<string>(''),
    phone_number: new FormControl<string>(''),
    comment: new FormControl<string>(''),
  });
  onSubmit() {
    if (this.contactForm.valid) {
      const formValue = this.contactForm.value;
      const callData = {
        fio: formValue.fio ?? '',
        phone_number: formValue.phone_number ?? '',
        comment: formValue.comment ?? '',
      };
      this.callRequestsService.addCall(callData).subscribe({
        next: (response: { detail?: string }) => {
          this.notificationService.success(
            response?.detail || 'Данные отправлены'
          );
        },
        error: (error: { detail?: string }) => {
          this.notificationService.error(
            error?.detail || 'Ошибка при отправке данных'
          );
        },
      });
    }
  }
}
