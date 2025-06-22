import { BrigadeUpdatePayload } from '@/shared/interfaces/brigade.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BE_HOST } from '../../../env';

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
  editBrigade(data: BrigadeUpdatePayload[]) {
    const payload = {
      brigads: data,
    };
    console.log('payload', payload);
    return this.httpClient.put(this.apiUrls.editBrigade, payload, {
      withCredentials: true,
    });
  }
  freeBrigade() {
    return this.httpClient.get(this.apiUrls.freeBrigade, {
      withCredentials: true,
    });
  }
}
