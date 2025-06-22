import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_BE_HOST } from '../../../env';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrls = {
    login: API_BE_HOST + 'auth/login/',
    register: API_BE_HOST + 'auth/register/',
    me: API_BE_HOST + 'users/me/',
    logout: API_BE_HOST + 'auth/logout/',
  };

  private readonly httpClient = inject(HttpClient);

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  public isLoggedIn$: Observable<boolean> =
    this.isLoggedInSubject.asObservable();

  private sessionData: { user: any; septic: any } | null = null;

  register(registerData: {
    email: string;
    password: string;
    name: string;
    surname: string;
    patronymic: string;
  }) {
    const payload = {
      email: registerData.email,
      password: registerData.password,
      name: registerData.name,
      surname: registerData.surname,
      patronymic: registerData.patronymic,
    };
    return this.httpClient.post(this.apiUrls.register, payload);
  }

  login(loginData: { email: string; password: string }) {
    const payload = {
      email: loginData.email,
      password: loginData.password,
    };
    return this.httpClient
      .post(this.apiUrls.login, payload, {
        withCredentials: true,
      })
      .pipe(
        tap(() => {
          this.isLoggedInSubject.next(true);
        })
      );
  }

  checkAuth() {
    this.httpClient
      .get<{ user: any; septic: any }>(this.apiUrls.me, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          this.isLoggedInSubject.next(true);
          this.sessionData = res;
        },
        error: (err) => {
          this.isLoggedInSubject.next(false);
          this.sessionData = null;
        },
      });
  }

  getSessionData(): Observable<{ user: any; septic: any } | null> {
    if (this.sessionData) {
      return new BehaviorSubject(this.sessionData).asObservable();
    }
    return this.httpClient
      .get<{ user: any; septic: any }>(this.apiUrls.me, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          this.sessionData = res;
          this.isLoggedInSubject.next(true);
        })
      );
  }

  logout(): Observable<any> {
    return this.httpClient
      .post(this.apiUrls.logout, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.isLoggedInSubject.next(false);
          this.sessionData = null;
        })
      );
  }
}
