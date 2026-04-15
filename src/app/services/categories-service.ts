import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { CategoriesModel } from '../models/categories-model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastService } from './toast-service';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  private baseUrl = environment.baseUrl;

  private _categories = signal<CategoriesModel[]>([]);
  private _isLoading = signal<boolean>(false);

  readonly categories = this._categories.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  getCategories(): Observable<{ data: CategoriesModel[] }> {
    return this.http.get<{ data: CategoriesModel[] }>(`${this.baseUrl}/categories`).pipe(
      tap(({ data }) => {
        this._categories.set(data);

        this._isLoading.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        this.toast.showToast({
          message: err.error?.detail || 'Failed to load products',
          type: 'error',
        });

        this._isLoading.set(false);

        return throwError(() => err);
      }),
    );
  }
}
