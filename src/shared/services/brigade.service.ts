import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BE_HOST } from '../../../env';
import {
  Brigade,
  BrigadeUpdatePayload,
} from '@/shared/interfaces/brigade.interface';

@Injectable({
  providedIn: 'root',
})
export class BrigadeService {
  private apiUrls = {
    allBrigades: API_BE_HOST + 'workman_brigadiers/',
    editBrigade: API_BE_HOST + 'workman_brigadiers/edit/',
    freeBrigade: API_BE_HOST + 'workman_brigadiers/free_workers/',
  };

  private readonly httpClient = inject(HttpClient);

  getAllBrigades() {
    return this.httpClient.get(this.apiUrls.allBrigades, {
      withCredentials: true,
    });
  }
  editBrigade(payload: BrigadeUpdatePayload) {
    return this.httpClient.post(this.apiUrls.editBrigade, payload, {
      withCredentials: true,
    });
  }
  freeBrigade() {
    return this.httpClient.get(this.apiUrls.freeBrigade, {
      withCredentials: true,
    });
  }
}
