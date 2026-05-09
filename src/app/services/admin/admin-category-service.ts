import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../toast-service';
import { environment } from '../../../environments/environment.development';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminCategoryService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  private baseUrl = environment.baseUrl;
  private _isLoading = signal<boolean>(false);

  readonly isLoading = this._isLoading.asReadonly();

  createCategory({ name }: { name: string }) {
    this._isLoading.set(true);

    return this.http.post(`${this.baseUrl}/categories`, { name }).pipe(
      tap((res) => {
        this.toast.showToast({
          type: 'success',
          message: 'Category created successfully.',
        });

        this._isLoading.set(false);
      }),

      catchError((err: HttpErrorResponse) => {
        this.toast.showToast({
          type: 'error',
          message: 'Failed to create category',
        });

        this._isLoading.set(false);

        return throwError(() => err);
      }),
    );
  }

  updateCategory({ name, id }: { name: string; id: number }) {
    this._isLoading.set(true);

    return this.http.put(`${this.baseUrl}/categories/${id}`, { name }).pipe(
      tap((res) => {
        this.toast.showToast({
          type: 'success',
          message: 'Category updated successfully.',
        });

        this._isLoading.set(false);
      }),
      catchError((err) => {
        this.toast.showToast({
          type: 'error',
          message: 'Failed to update category',
        });

        this._isLoading.set(false);

        return throwError(() => err);
      }),
    );
  }

  deleteCategory({ categoryId }: { categoryId: number }) {
    return this.http.delete(`${this.baseUrl}/categories/${categoryId}`).pipe(
      tap((res) => {
        this.toast.showToast({
          type: 'success',
          message: 'Category deleted successfully.',
        });
      }),
      catchError((err: HttpErrorResponse) => {
        this.toast.showToast({
          type: 'error',
          message: 'Failed to delete category',
        });

        return throwError(() => err);
      }),
    );
  }
}
