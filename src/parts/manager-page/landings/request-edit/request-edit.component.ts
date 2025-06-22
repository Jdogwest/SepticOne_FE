import { RequestFormData } from '@/manager-page/interfaces/request-form.interface';
import { BrigadierResponse } from '@/shared/interfaces/brigadier-response.interface';
import { BrigadeService } from '@/shared/services/brigade.service';
import { NotificationService } from '@/shared/services/notification.service';
import { RequestsService } from '@/shared/services/requests.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatePickerModule } from 'primeng/datepicker';

type FormControlsOf<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

@Component({
  selector: 'app-request-edit',
  standalone: true,
  imports: [CommonModule, DatePickerModule, ReactiveFormsModule],
  templateUrl: './request-edit.component.html',
  styleUrl: './request-edit.component.scss',
})
export class RequestEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly requestsService = inject(RequestsService);
  private readonly brigadeService = inject(BrigadeService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  brigades = signal<BrigadierResponse[]>([]);

  busyDates: Date[] = [
    new Date('2025-06-03'),
    new Date('2025-06-04'),
    new Date('2025-06-05'),
  ];

  client = {
    surname: 'Не указано',
    name: 'Не указано',
    patronymic: 'Не указано',
    phone_number: 'Не указано',
  };

  septic = {
    model: 'Не указано',
    volume: 'Не указано',
    city: 'Не указано',
    street: 'Не указано',
    house: 'Не указано',
  };

  services: { service_id: number; name: string; amount: number }[] = [];

  serviceName = 'Не указано';
  plannedDate = 'Не указано';
  comment = 'Не указано';
  summary = 0;

  requestForm = new FormGroup<FormControlsOf<RequestFormData>>({
    contractNumber: new FormControl(''),
    status: new FormControl('none'),
    date: new FormControl<Date | null>(null), // ✅
    time: new FormControl('none'),
    brigade: new FormControl('none'),
    comment: new FormControl(''),
    work_comment: new FormControl(''),
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.requestsService.getById(id).subscribe((res: any) => {
      const dateValue = res.planed_start_date
        ? new Date(res.planed_start_date)
        : null;

      const timeValue = res.planed_start_time
        ? res.planed_start_time.slice(0, 5)
        : 'none';

      this.requestForm.patchValue({
        contractNumber: res.contract_number || '',
        status: res.status || 'none',
        date: dateValue,
        time: timeValue,
        brigade: 'none',
        comment: res.comment || '',
        work_comment: res.work_comment || '',
      });

      this.client = {
        surname: res.client?.surname || 'Не указано',
        name: res.client?.name || 'Не указано',
        patronymic: res.client?.patronymic || 'Не указано',
        phone_number: res.client?.phone_number || 'Не указано',
      };

      this.septic = {
        model: res.septic?.model || 'Не указано',
        volume: res.septic?.volume || 'Не указано',
        city: res.septic?.city || 'Не указано',
        street: res.septic?.street || 'Не указано',
        house: res.septic?.house || 'Не указано',
      };

      this.services = res.services || [];

      // Можно для отображения где-то еще оставить форматированную дату
      this.plannedDate = dateValue
        ? dateValue.toLocaleDateString('ru-RU')
        : 'Не указано';
      this.comment = res.comment || 'Не указано';
      this.summary = res.summary;
    });

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
              console.log(this.brigades());
            },
          });
        },
      });
  }

  onSave() {
    if (this.requestForm.valid) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (!id) return;

      const formValue = this.requestForm.getRawValue();

      const date = formValue.date;
      const time = formValue.time;

      if (!date || !time) {
        console.warn('Дата или время не выбраны');
        return;
      }
      const dateObj = new Date(date);
      const dateStr = dateObj.toISOString().split('T')[0];

      const planedTime = `${time}:00`;

      const requestData = {
        status: formValue.status,
        planed_start_date: dateStr,
        planed_start_time: planedTime,
        brigadier_id: Number(formValue.brigade),
        contract_number: formValue.contractNumber,
        comment: formValue.comment,
        work_comment: formValue.work_comment,
      };
      console.log(requestData);
      this.requestsService.editByIdRequest(id, requestData).subscribe({
        next: () => {
          console.log('Заявка успешно обновлена');
          this.notificationService.success('Заявка успешно обновлена');
        },
        error: (err) => {
          console.error('Ошибка при обновлении заявки', err);
          this.notificationService.error('Ошибка при обновлении заявки');
        },
      });
    }
  }
}
