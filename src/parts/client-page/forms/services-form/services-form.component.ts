import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ServicesFormData } from '@/shared/interfaces/services-form.interface';
import { ServiceService } from '@/shared/services/services.service';
import { Service } from '@/shared/interfaces/Service.interface';
import { RequestsService } from '@/shared/services/requests.service';
import { AddRequestPayload } from '@/shared/interfaces/requests.interface';
import { NotificationService } from '@/shared/services/notification.service';
import { DatePicker } from 'primeng/datepicker';

type FormControlsOf<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

@Component({
  selector: 'app-services-form',
  imports: [CommonModule, ReactiveFormsModule, DatePicker],
  templateUrl: './services-form.component.html',
  styleUrl: './services-form.component.scss',
})
export class ServicesFormComponent {
  services: Service[] = [];
  private readonly serviceService = inject(ServiceService);
  private readonly requestsService = inject(RequestsService);

  private notificationService = inject(NotificationService);

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.serviceService.getAllServices().subscribe(
      (data) => {
        this.services = data as Service[];
        console.log(this.services);
      },
      (err) => {
        console.error('Ошибка при получении услуг:', err);
      }
    );
  }

  serviceForm = new FormGroup<FormControlsOf<ServicesFormData>>({
    service: new FormControl<{ id: string; quantity: number }[]>([], {
      nonNullable: true,
    }),

    quantity: new FormControl<number | null>(null),
    date: new FormControl<Date | null>(null),
    time: new FormControl<string>(''),
    comment: new FormControl<string>(''),
  });

  selectedServiceId = new FormControl<string>('none');

  showSelect = true;

  today: Date = new Date();

  busyDates: Date[] = [
    new Date('2025-06-07'),
    new Date('2025-06-08'),
    new Date('2025-06-09'),
  ];
  times = [
    { label: '08:00', value: '08:00' },
    { label: '09:00', value: '09:00' },
    { label: '10:00', value: '10:00' },
  ];

  isDateAvailable = (date: Date): boolean => {
    const dateStr = date.toDateString();
    return !this.busyDates.some((busy) => busy.toDateString() === dateStr);
  };

  get selectedService(): (Service & { quantity: number })[] {
    const selected = this.serviceForm.controls.service.value ?? [];
    return selected
      .map((s) => {
        const service = this.services.find((srv) => String(srv.id) === s.id);
        return service ? { ...service, quantity: s.quantity } : null;
      })
      .filter((s): s is Service & { quantity: number } => s !== null);
  }

  addService() {
    const id = this.selectedServiceId.value;
    if (id && id !== 'none') {
      const current = this.serviceForm.controls.service.value ?? [];
      const existingIndex = current.findIndex((s) => s.id === id);

      if (existingIndex !== -1) {
        const updated = [...current];
        updated[existingIndex].quantity += 1;
        this.serviceForm.controls.service.setValue(updated);
      } else {
        this.serviceForm.controls.service.setValue([
          ...current,
          { id, quantity: 1 },
        ]);
      }

      this.selectedServiceId.setValue('none');
      this.showSelect = false;
    }
  }

  get totalCost(): number {
    return this.selectedService.reduce((sum, service) => {
      return sum + service.price * service.quantity;
    }, 0);
  }

  increaseQuantity(index: number) {
    const current = this.serviceForm.controls.service.value ?? [];
    const updated = current.map((item, i) =>
      i === index ? { ...item, quantity: item.quantity + 1 } : item
    );
    this.serviceForm.controls.service.setValue(updated);
  }

  decreaseQuantity(index: number) {
    const current = this.serviceForm.controls.service.value ?? [];
    const updated = [...current];

    if (updated[index].quantity > 1) {
      updated[index].quantity -= 1;
    } else {
      updated.splice(index, 1);
      if (updated.length === 0) {
        this.showSelect = true;
      }
    }

    this.serviceForm.controls.service.setValue(updated);
  }

  showAddSelect() {
    this.showSelect = true;
  }

  removeService(index: number) {
    const current = this.serviceForm.controls.service.value ?? [];
    const updated = [...current];
    updated.splice(index, 1);
    this.serviceForm.controls.service.setValue(updated);
    if (updated.length === 0) {
      this.showSelect = true;
    }
  }

  onSubmit() {
    if (this.serviceForm.valid) {
      const formValue = this.serviceForm.value;

      const date = formValue.date;
      const time = formValue.time;

      if (!date || !time) {
        console.warn('Дата или время не выбраны');
        return;
      }

      const dateStr = date.toISOString().split('T')[0];

      const [hours, minutes] = time.split(':');
      const planedTime = new Date(date);
      planedTime.setHours(Number(hours), Number(minutes), 0, 0);

      const payload: AddRequestPayload = {
        planed_start_date: dateStr,
        planed_start_time: time,
        comment: formValue.comment ?? '',
        services: (formValue.service ?? []).map((s) => ({
          service_id: Number(s.id),
          amount: s.quantity,
        })),
      };
      console.log(payload);

      this.requestsService.addRequest(payload).subscribe({
        next: (res: any) => {
          this.notificationService.success(
            res?.detail || 'Заявка успешно создана'
          );
        },
        error: (err) => {
          this.notificationService.error(
            err?.error?.detail || 'Ошибка создания заявки'
          );
        },
      });
    }
  }
}
