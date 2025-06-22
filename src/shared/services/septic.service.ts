import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BE_HOST } from '../../../env';

@Injectable({
  providedIn: 'root',
})
export class SepticService {
  private apiUrls = {
    editSeptic: API_BE_HOST + 'septics/edit-septic/',
  };

  private readonly httpClient = inject(HttpClient);

  editSeptic(septicData: {
    city: string;
    street: string;
    house: string;
    model: string;
    volume: number | null;
  }) {
    const payload = {
      city: septicData.city,
      street: septicData.street,
      house: septicData.house,
      model: septicData.model,
      volume: septicData.volume,
    };
    return this.httpClient.put(this.apiUrls.editSeptic, payload, {
      withCredentials: true,
    });
  }
}
