import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BE_HOST } from '../../../env';
import { Service } from '@/shared/interfaces/Service.interface';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private apiUrls = {
    allService: API_BE_HOST + 'services/',
  };

  private readonly httpClient = inject(HttpClient);

  getAllServices() {
    return this.httpClient.get<Service[]>(this.apiUrls.allService, {
      withCredentials: true,
    });
  }
}
