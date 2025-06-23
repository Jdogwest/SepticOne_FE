import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { DatePickerModule } from 'primeng/datepicker';
import { RequestsService } from '@/shared/services/requests.service';
import { NotificationService } from '@/shared/services/notification.service';
import { BrigadeService } from '@/shared/services/brigade.service';
import { ServiceService } from '@/shared/services/services.service';
import { Service } from '@/shared/interfaces/service.interface';
import { BrigadierResponse } from '@/shared/interfaces/brigadier-response.interface';
import { CommonModule } from '@angular/common';
import { Brigade } from '@/shared/interfaces/brigade.interface';

type ServiceWithQuantity = Service & { quantity: number };

@Component({
  selector: 'app-request-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule, DatePickerModule, CommonModule],
  templateUrl: './request-edit-form.component.html',
  styleUrl: './request-edit-form.component.scss',
})
export class RequestEditFormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly requestsService = inject(RequestsService);
  private readonly notificationService = inject(NotificationService);
  private readonly brigadeService = inject(BrigadeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly serviceService = inject(ServiceService);
  brigades = signal<BrigadierResponse[]>([]);

  requestForm = new FormGroup({
    services: new FormControl<ServiceWithQuantity[]>([], { nonNullable: true }),
    quantity: new FormControl<number | null>(null),
    contractNumber: new FormControl(''),
    status: new FormControl('none'),
    date: new FormControl<Date | null>(null),
    time: new FormControl('none'),
    brigade: new FormControl('none'),
    comment: new FormControl(''),
    work_comment: new FormControl(''),
  });

  services: Service[] = [];
  brigade: Brigade[] = [];

  selectedServiceId = new FormControl<string>('none');
  showSelect = false;
  times = [
    { label: '08:00', value: '08:00' },
    { label: '09:00', value: '09:00' },
    { label: '10:00', value: '10:00' },
  ];

  busyDates: Date[] = [
    new Date('2025-06-03'),
    new Date('2025-06-04'),
    new Date('2025-06-05'),
  ];

  ngOnInit(): void {
    this.loadServices();
    this.loadRequest();
    this.requestForm.controls.date.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (date) => {
          const day =
            Number(date?.getDate()) < 10
              ? '0' + date?.getDate()
              : date?.getDate();
          const month =
            Number(date?.getMonth()) + 1 < 10
              ? '0' + (Number(date?.getMonth()) + 1)
              : Number(date?.getMonth()) + 1;
          const year = date?.getFullYear();
          const dateStr = `${year}-${month}-${day}`;

          this.requestsService.getBrigadesOnDate(dateStr).subscribe({
            next: (response: any) => {
              this.brigades.set(response);
            },
          });
        },
      });
  }

  loadServices() {
    this.serviceService.getAllServices().subscribe({
      next: (res) => (this.services = res),
      error: () => this.notificationService.error('Ошибка загрузки услуг'),
    });
  }

  loadRequest() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.brigadeService.getAllBrigades;

    this.requestsService.getById(id).subscribe((res: any) => {
      const dateValue = res.planed_start_date
        ? new Date(res.planed_start_date)
        : null;
      const timeValue = res.planed_start_time
        ? res.planed_start_time.slice(0, 5)
        : 'none';

      const servicesFromRequest: ServiceWithQuantity[] = res.services
        .map((s: any) => {
          const fullService = this.services.find(
            (srv) => srv.id === s.service_id
          );
          return fullService ? { ...fullService, quantity: s.amount } : null;
        })
        .filter(
          (s: ServiceWithQuantity | null): s is ServiceWithQuantity => !!s
        );

      this.requestForm.patchValue({
        contractNumber: res.contract_number || '',
        status: res.status || 'none',
        date: dateValue,
        time: timeValue,
        brigade: String(res.brigadier_id ?? 'none'),
        comment: res.comment || '',
        work_comment: res.work_comment || '',
        services: servicesFromRequest,
      });

      this.handleDateChange(dateValue);
    });

    this.requestForm.controls.date.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((date) => this.handleDateChange(date));
  }

  handleDateChange(date: Date | null) {
    if (!date) return;

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    this.requestsService.getBrigadesOnDate(dateStr).subscribe({
      next: (response: any) => {},
    });
  }
  showAddSelect() {
    this.showSelect = true;
  }
  get selectedServices(): ServiceWithQuantity[] {
    return this.requestForm.controls.services.value ?? [];
  }

  get totalCost(): number {
    return this.selectedServices.reduce((sum, service) => {
      return sum + service.price * service.quantity;
    }, 0);
  }

  addService() {
    const id = this.selectedServiceId.value;
    if (id && id !== 'none') {
      const current = this.requestForm.controls.services.value ?? [];
      const existingIndex = current.findIndex((s) => String(s.id) === id);

      if (existingIndex !== -1) {
        current[existingIndex].quantity += 1;
      } else {
        const found = this.services.find((s) => String(s.id) === id);
        if (found) {
          current.push({ ...found, quantity: 1 });
        }
      }

      this.requestForm.controls.services.setValue([...current]);
      this.selectedServiceId.setValue('none');
      this.showSelect = false;
    }
  }

  removeService(index: number) {
    const updated = [...this.selectedServices];
    updated.splice(index, 1);
    this.requestForm.controls.services.setValue(updated);
    if (updated.length === 0) {
      this.showSelect = true;
    }
  }

  increaseQuantity(index: number) {
    const current = this.selectedServices;
    current[index].quantity += 1;
    this.requestForm.controls.services.setValue([...current]);
  }

  decreaseQuantity(index: number) {
    const current = this.selectedServices;
    if (current[index].quantity > 1) {
      current[index].quantity -= 1;
    } else {
      this.removeService(index);
    }
    this.requestForm.controls.services.setValue([...current]);
  }

  onSave() {
    if (this.requestForm.invalid) return;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    const value = this.requestForm.getRawValue();
    const dateStr = value.date?.toISOString().split('T')[0] ?? '';
    const timeStr = value.time + ':00';

    const payload = {
      contract_number: value.contractNumber,
      status: value.status,
      planed_start_date: dateStr,
      planed_start_time: timeStr,
      brigadier_id: Number(value.brigade),
      comment: value.comment,
      work_comment: value.work_comment,
      services: value.services.map((s) => ({
        service_id: Number(s.id),
        amount: s.quantity,
      })),
    };
    this.requestsService.editByIdRequest(id, payload).subscribe({
      next: () => this.notificationService.success('Заявка успешно обновлена'),
      error: () =>
        this.notificationService.error('Ошибка при обновлении заявки'),
    });
  }
}
