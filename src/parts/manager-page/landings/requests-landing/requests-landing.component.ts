import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RequestsService } from '@/shared/services/requests.service';
import { MyRequest } from '@/shared/interfaces/my-request.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-requests-landing',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './requests-landing.component.html',
  styleUrl: './requests-landing.component.scss',
})
export class RequestsLandingComponent implements OnInit {
  requests: MyRequest[] = [];
  sortedRequests: MyRequest[] = [];

  form = new FormGroup({
    status: new FormControl('all'),
  });

  private readonly requestsService = inject(RequestsService);

  statusMap: Record<string, string> = {
    new: 'Новая',
    in_work: 'В работе',
    complete: 'Завершена',
    cancelled: 'Отменена',
  };

  ngOnInit(): void {
    this.form.get('status')?.valueChanges.subscribe((status) => {
      this.loadRequests(status || 'all');
    });

    this.loadRequests('all');
  }

  private loadRequests(status: string): void {
    const statusParam =
      status === 'all' || status === 'old'
        ? undefined
        : status === 'completed'
        ? 'complete'
        : status;

    this.requestsService.getAllRequests(statusParam).subscribe({
      next: (data) => {
        this.requests = data as MyRequest[];
        this.sortRequests(status);
      },
      error: (err) => {
        console.error('Ошибка при получении заявок', err);
      },
    });
  }

  private sortRequests(status: string): void {
    const priority: Record<string, number> = {
      new: 1,
      in_work: 2,
      complete: 3,
      cancelled: 4,
    };

    this.sortedRequests = [...this.requests].sort((a, b) => {
      if (status === 'old') {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }

      const priorityA = priority[a.status] ?? 999;
      const priorityB = priority[b.status] ?? 999;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }
}
