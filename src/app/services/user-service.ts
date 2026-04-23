import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { ProfileModel } from '../models/profile-model';
import { catchError, forkJoin, Observable, tap, throwError } from 'rxjs';
import { ProfileFormModel } from '../interfaces/profile-form';
import { ToastService } from './toast-service';
import { AuthService } from './auth-service';
import { NewPasswordModel } from '../models/new-password-model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private auth = inject(AuthService);

  private baseUrl = environment.baseUrl;

  private _profile = signal<ProfileModel | null>(null);
  private _isLoading = signal<boolean>(false);

  readonly profile = this._profile.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

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

            this.toast.showToast({
              message: 'Profile updated successfully',
              type: 'success',
            });
          }
        }),
        catchError((err: HttpErrorResponse) => {
          this.toast.showToast({ message: err.error?.detail || 'Failed to update', type: 'error' });

          return throwError(() => err);
        }),
      );
  }

  updatePassword(data: NewPasswordModel) {
    this._isLoading.set(true);

    return this.http
      .put<{
        isSuccess: boolean;
        error: { message: string } | null;
      }>(`${this.baseUrl}/users/change-password`, data)
      .pipe(
        tap((res): void => {
          if (res.isSuccess) {
            this.toast.showToast({
              message: 'Password updated successfully',
              type: 'success',
            });
          }

          this._isLoading.set(false);
        }),
        catchError((err: HttpErrorResponse) => {
          this.toast.showToast({
            message: err.error?.detail || 'Failed to update password',
            type: 'error',
          });

          this._isLoading.set(false);

          return throwError(() => err);
        }),
      );
  }

  deleteAccount() {
    return this.http
      .delete<{
        isSuccess: boolean;
        error: { message: string } | null;
      }>(`${this.baseUrl}/users/delete`)
      .pipe(
        tap(({ isSuccess }) => {
          if (isSuccess) {
            this.toast.showToast({
              message: 'Account deleted successfully',
              type: 'success',
            });

            this.auth.logout();
          }
        }),
        catchError((err: HttpErrorResponse) => {
          this.toast.showToast({
            message: err.error?.detail || 'Failed to delete account',
            type: 'error',
          });

          return throwError(() => err);
        }),
      );
  }
}
