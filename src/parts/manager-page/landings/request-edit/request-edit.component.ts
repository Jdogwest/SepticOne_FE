import { RequestEditFormComponent } from '@/manager-page/forrms/request-edit-form/request-edit-form.component';
import { RequestsService } from '@/shared/services/requests.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-request-edit',
  standalone: true,
  imports: [CommonModule, RequestEditFormComponent],
  templateUrl: './request-edit.component.html',
  styleUrl: './request-edit.component.scss',
})
export class RequestEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly requestsService = inject(RequestsService);

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

  requestId = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.requestsService.getById(id).subscribe((res: any) => {
      const dateValue = res.planed_start_date
        ? new Date(res.planed_start_date)
        : null;

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

      this.requestId = res.id;

      this.plannedDate = dateValue
        ? dateValue.toLocaleDateString('ru-RU')
        : 'Не указано';
      this.comment = res.comment || 'Не указано';
      this.summary = res.summary;
    });
  }
}
