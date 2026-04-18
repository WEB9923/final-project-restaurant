import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IRegisterModel } from '../interfaces/register-form';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ToastService } from './toast-service';
import { Router } from '@angular/router';
import { ILoginModel } from '../interfaces/login-form';
import { jwtDecode } from 'jwt-decode';
import { JwtModel } from '../models/jwt-model';
import { MeModel } from '../models/me-model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private toast = inject(ToastService);
  private router = inject(Router);

  private baseUrl = environment.baseUrl;
  private readonly ACCESS_KEY = 'access_token';
  private readonly REFRESH_KEY = 'refresh_token';

  private _currentUser = signal<MeModel | null>(null);
  private _isLoading = signal<boolean>(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed((): boolean => !!this._currentUser());
  readonly isLoading = this._isLoading.asReadonly();

  constructor() {
    this.initializeFromStorage();
  }

  register(data: IRegisterModel): Observable<{ token: string }> {
    this._isLoading.set(true);

    return this.httpClient.post<{ token: string }>(`${this.baseUrl}/auth/register`, data).pipe(
      tap((): void => {
        this.toast.showToast({
          message: 'Account created. Please check your email',
          type: 'success',
        });

        this._isLoading.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        const apiError = err.error;

        const message = apiError?.detail || apiError?.title || 'Registration failed';

        this.toast.showToast({
          message,
          type: 'error',
        });

        this._isLoading.set(false);

        return throwError(() => err);
      }),
    );
  }

  login(credentials: ILoginModel) {
    this._isLoading.set(true);

    return this.httpClient
      .post<{
        data: {
          accessToken: string;
          refreshToken: string;
          isVerified: boolean;
        };
      }>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        tap((res) => {
          if (res.data.isVerified) {
            this.handleTokens({
              accessToken: res.data.accessToken,
              refreshToken: res.data.refreshToken,
            });

            this.router.navigate(['/'], { replaceUrl: true });
          }

          this._isLoading.set(false);
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.error.status === 406) {
            this.toast.showToast({
              message: err.error.detail || 'Please verify your email',
              type: 'warning',
              time: 5000,
            });

            this.router.navigate(['/auth/verify'], {
              queryParams: { email: credentials.email },
            });
          } else {
            this.toast.showToast({
              message: err.error.detail || 'Login failed',
              type: 'error',
            });
          }

          this._isLoading.set(false);

          return throwError(() => err);
        }),
      );
  }

  verify({ email, code }: { email: string; code: string }) {
    const payload = {
      email,
      code,
    };

    return this.httpClient
      .put<{
        data: {
          accessToken: string;
          refreshToken: string;
          isVerified: boolean;
        };
      }>(`${this.baseUrl}/auth/verify-email`, payload)
      .pipe(
        tap((res) => {
          this.handleTokens({
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
          });

          this.toast.showToast({
            message: 'Email verified successfully',
            type: 'success',
          });

          this.router.navigate(['/'], { replaceUrl: true });
        }),
        catchError((err: HttpErrorResponse) => {
          this.toast.showToast({
            message: err.error?.detail || 'Invalid or expired code',
            type: 'error',
          });

          return throwError(() => err);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);

    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  fetchMe(): Observable<{ data: MeModel }> {
    this._isLoading.set(true);

    return this.httpClient.get<{ data: MeModel }>(`${this.baseUrl}/users/me`).pipe(
      tap({
        next: (res): void => {
          this._currentUser.set(res.data);
        },
        error: (): void => {
          this._isLoading.set(false);
          this.logout();
        },
      }),
    );
  }

  private handleTokens(tokens: { accessToken: string; refreshToken: string }): void {
    localStorage.setItem(this.ACCESS_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_KEY, tokens.refreshToken);

    this.fetchMe().subscribe();
  }

  private initializeFromStorage(): void {
    const token = this.getAccessToken();

    if (!token) return;

    if (this.isTokenExpired(token)) {
      this.logout();
      return;
    }

    this.fetchMe().subscribe();
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  isTokenExpired(token: string): boolean {
    const decoded = jwtDecode<JwtModel>(token);

    if (!decoded) return true;

    return decoded.exp * 1000 < Date.now();
  }
}
