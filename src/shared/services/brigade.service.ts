import {
  Brigade,
  BrigadeUpdatePayload,
} from '@/shared/interfaces/brigade.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BE_HOST } from '../../../env';
import { Observable } from 'rxjs';
import { BusyDateResponse } from '@/manager-page/interfaces/brigade-status.interface';

@Injectable({
  providedIn: 'root',
})
export class BrigadeService {
  private apiUrls = {
    allBrigades: API_BE_HOST + 'workman_brigadiers/',
    editBrigade: API_BE_HOST + 'workman_brigadiers/edit/',
    freeBrigade: API_BE_HOST + 'workman_brigadiers/free_workers/',
    busyByDatesBrigades: API_BE_HOST + 'workman_brigadiers/busy_by_dates/',
  };

  private readonly httpClient = inject(HttpClient);

  getAllBrigades(): Observable<Brigade[]> {
    return this.httpClient.get<Brigade[]>(this.apiUrls.allBrigades, {
      withCredentials: true,
    });
  }
  editBrigade(data: BrigadeUpdatePayload[]) {
    const payload = {
      brigads: data,
    };
    return this.httpClient.put(this.apiUrls.editBrigade, payload, {
      withCredentials: true,
    });
  }
  freeBrigade() {
    return this.httpClient.get(this.apiUrls.freeBrigade, {
      withCredentials: true,
    });
  }
  getBrigadeBusyDate(): Observable<BusyDateResponse[]> {
    return this.httpClient.get<BusyDateResponse[]>(
      this.apiUrls.busyByDatesBrigades,
      { withCredentials: true }
    );
  }
}
