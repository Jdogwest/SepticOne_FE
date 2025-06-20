import { MyRequest } from '@/shared/interfaces/my-request.interface';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-requests-list',
  imports: [],
  templateUrl: './requests-list.component.html',
  styleUrl: './requests-list.component.scss',
})
export class RequestsListComponent {
  @Input() requests: MyRequest[] = [];
  statusMap: Record<string, string> = {
    new: 'Новая',
    in_work: 'В работе',
    complete: 'Завершена',
    cancelled: 'Отменена',
  };

  get sortedRequests(): MyRequest[] {
    const priority: Record<string, number> = {
      new: 1,
      in_work: 2,
      complete: 3,
      cancelled: 4,
    };

    return [...this.requests].sort((a, b) => {
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
