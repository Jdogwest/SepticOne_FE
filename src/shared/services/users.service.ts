import { UserFormData } from '@/shared/interfaces/user-form.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BE_HOST } from '../../../env';
import { UserUpdate } from '@/manager-page/interfaces/user-edit.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrls = {
    allUsers: API_BE_HOST + 'users/all_users/',
    userById: (id: number) => API_BE_HOST + `users/${id}/`,
    editUser: API_BE_HOST + 'users/edit-user/',
    getAllClients: API_BE_HOST + 'users/all_clients/',
    updateUserFull: (id: number) => API_BE_HOST + `users/edit-user-full/${id}`,
    updateUserAndRole: (id: number) =>
      API_BE_HOST + `users/edit-user-and-role/${id}`,
  };

  private readonly httpClient = inject(HttpClient);

  getAllUsers() {
    return this.httpClient.get(this.apiUrls.allUsers, {
      withCredentials: true,
    });
  }

  getAllClients() {
    return this.httpClient.get(this.apiUrls.getAllClients, {
      withCredentials: true,
    });
  }

  getUserById(id: number) {
    return this.httpClient.get(this.apiUrls.userById(id), {
      params: { user_id: id.toString() },
      withCredentials: true,
    });
  }

  editUser(userData: UserFormData): Observable<any> {
    return this.httpClient.put(this.apiUrls.editUser, userData, {
      withCredentials: true,
    });
  }
  updateUserFull(id: number, data: UserUpdate) {
    return this.httpClient.put(this.apiUrls.updateUserFull(id), data, {
      withCredentials: true,
    });
  }

  updateUserAndRole(id: number, data: UserUpdate) {
    return this.httpClient.put(this.apiUrls.updateUserAndRole(id), data, {
      withCredentials: true,
    });
  }
}
