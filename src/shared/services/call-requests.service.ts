import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BE_HOST } from '../../../env';
import { CallRequest } from '@/manager-page/interfaces/call-requests.interface';
import { BusyDateResponse } from '@/manager-page/interfaces/brigade-status.interface';

@Injectable({
  providedIn: 'root',
})
export class CallRequestsService {
  private apiUrls = {
    addCall: API_BE_HOST + 'call-requests/add-call-request/',
    getCallRequests: API_BE_HOST + 'call-requests/',
    editCallRequests: (id: number) =>
      API_BE_HOST + `call-requests/edit-call-request/${id}`,
  };

  private readonly httpClient = inject(HttpClient);

  addCall(callData: { fio: string; phone_number: string; comment: string }) {
    const payload = {
      fio: callData.fio,
      phone_number: callData.phone_number,
      comment: callData.comment,
    };
    return this.httpClient.post(this.apiUrls.addCall, payload, {
      withCredentials: true,
    });
  }
  getCallRequests() {
    return this.httpClient.get<CallRequest[]>(this.apiUrls.getCallRequests, {
      withCredentials: true,
    });
  }

  editCallRequests(id: number, data: Partial<CallRequest>) {
    return this.httpClient.put<CallRequest>(
      this.apiUrls.editCallRequests(id),
      data,
      { withCredentials: true }
    );
  }
}
