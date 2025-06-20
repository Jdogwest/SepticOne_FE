import { CallRequestsService } from '@/shared/services/call-requests.service';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-call-requests',
  imports: [],
  templateUrl: './call-requests-landing.component.html',
  styleUrl: './call-requests-landing.component.scss',
})
export class CallRequestsLandingComponent implements OnInit {
  callRequests: any[] = [];

  callRequestsService = inject(CallRequestsService);

  ngOnInit(): void {
    this.callRequestsService.getCallRequests().subscribe({
      next: (data: any) => {
        this.callRequests = data;
      },
      error: (error: unknown) => {
        console.error('Ошибка при получении заявок:', error);
      },
    });
  }
}
