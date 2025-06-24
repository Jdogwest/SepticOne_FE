import { CallRequest } from '@/manager-page/interfaces/call-requests.interface';
import { CallRequestsService } from '@/shared/services/call-requests.service';
import { NotificationService } from '@/shared/services/notification.service';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-call-requests',
  imports: [ReactiveFormsModule],
  templateUrl: './call-requests-landing.component.html',
  styleUrl: './call-requests-landing.component.scss',
})
export class CallRequestsLandingComponent implements OnInit {
  callRequests: CallRequest[] = [];
  callRequestsForms = new FormArray<FormGroup>([]);
  private readonly callRequestsService = inject(CallRequestsService);
  private readonly notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.callRequestsService.getCallRequests().subscribe({
      next: (data: CallRequest[]) => {
        this.callRequests = data;

        this.callRequestsForms.clear();
        data.forEach((req) => {
          this.callRequestsForms.push(
            new FormGroup({
              status: new FormControl(req.status),
              comment: new FormControl(req.comment),
            })
          );
        });
      },
      error: (err) => {
        // this.notificationService.error(
        //   `Ошибка при получении заявок: ${
        //     err?.error?.detail || 'Неизвестная ошибка'
        //   }`
        // );
        console.error(err);
      },
    });
  }

  onSave(index: number, requestId: number) {
    const form = this.callRequestsForms.at(index);
    if (!form.valid) return;

    const updatedData = form.getRawValue();

    this.callRequestsService
      .editCallRequests(requestId, updatedData)
      .subscribe({
        next: () => {
          this.notificationService.success('Заявка успешно обновлена');
          this.callRequests[index].status = updatedData.status;
          this.callRequests[index].comment = updatedData.comment;
        },
        error: (err) => {
          // this.notificationService.error(
          //   `Ошибка при обновлении заявки: ${
          //     err?.error?.detail || 'Неизвестная ошибка'
          //   }`
          // );
          console.error(err);
        },
      });
  }
}
