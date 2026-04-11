import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { ProfileModel } from '../models/profile-model';
import { catchError, forkJoin, Observable, tap, throwError } from 'rxjs';
import { ProfileFormModel } from '../interfaces/profile-form';
import { ToastService } from './toast-service';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private auth = inject(AuthService);

  private baseUrl = environment.baseUrl;

  private _profile = signal<ProfileModel | null>(null);
  readonly profile = this._profile.asReadonly();

  fetchProfile(): Observable<{ data: ProfileModel }> {
    return this.http.get<{ data: ProfileModel }>(`${this.baseUrl}/users/profile`).pipe(
      tap(({ data }): void => {
        this._profile.set(data);
      }),
    );
  }

  updateProfile({
    address,
    age,
    firstName,
    lastName,
    phoneNumber,
    picture,
  }: Partial<ProfileFormModel>) {
    return this.http
      .put<{ isSuccess: boolean; error: { message: string } | null }>(
        `${this.baseUrl}/users/edit`,
        {
          address,
          firstName,
          lastName,
          phoneNumber,
          age,
          picture,
        },
      )
      .pipe(
        tap((res): void => {
          if (res.isSuccess) {
            forkJoin({
              me: this.auth.fetchMe(),
              profile: this.fetchProfile(),
            }).subscribe();
          }
        }),
        catchError((err: HttpErrorResponse) => {
          this.toast.showToast({ message: err.error?.detail || 'Failed to update', type: 'error' });

          return throwError(() => err);
        }),
      );
  }
}
