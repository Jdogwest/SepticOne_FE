import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BE_HOST } from '../../../env';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  private apiUrls = {
    addRequest: API_BE_HOST + 'requests/add/',
    getMyRequests: API_BE_HOST + 'requests/my_requests/',
    getAllRequests: API_BE_HOST + 'requests/all/',
  };

  private readonly httpClient = inject(HttpClient);

  addRequest(requestData: {
    planed_start_date: string;
    planed_start_time: string;
    comment: string;
    services: {
      service_id: number;
      amount: number;
    }[];
  }) {
    return this.httpClient.post(this.apiUrls.addRequest, requestData, {
      withCredentials: true,
    });
  }

  getMyRequests() {
    return this.httpClient.get(this.apiUrls.getMyRequests, {
      withCredentials: true,
    });
  }

  getAllRequests(requestStatus?: string) {
    let params = new HttpParams();
    if (requestStatus) {
      params = params.set('request_status', requestStatus);
    }

    return this.httpClient.get(this.apiUrls.getAllRequests, {
      withCredentials: true,
      params,
    });
  }
}
