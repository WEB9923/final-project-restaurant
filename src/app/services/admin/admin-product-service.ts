import { inject, Injectable, signal } from '@angular/core';
import { ToastService } from '../toast-service';
import { environment } from '../../../environments/environment.development';
import { CreateProductModel } from '../../models/admin/create-product-model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminProductService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  private baseUrl = environment.baseUrl;

  private _isLoading = signal<boolean>(false);

  readonly isLoading = this._isLoading.asReadonly();

  createProduct(data: CreateProductModel) {
    this._isLoading.set(true);

    return this.http.post(`${this.baseUrl}/products`, data).pipe(
      tap((res) => {
        this.toast.showToast({
          type: 'success',
          message: `Product ${data.name} created successfully`,
        });

        this._isLoading.set(false);
      }),
      catchError((err: HttpErrorResponse) => {
        this.toast.showToast({
          type: 'error',
          message: 'Failed to create product',
        });

        this._isLoading.set(false);

        return throwError(() => err);
      }),
    );
  }

  updateProduct({ data, productId }: { data: CreateProductModel; productId: number }) {
    this._isLoading.set(true);

    return this.http
      .put<{ isSuccess: boolean }>(`${this.baseUrl}/products/${productId}`, data)
      .pipe(
        tap((res) => {
          this.toast.showToast({
            type: 'success',
            message: `Product ${data.name} updated successfully`,
          });

          this._isLoading.set(false);
        }),
        catchError((err: HttpErrorResponse) => {
          this.toast.showToast({
            type: 'error',
            message: 'Failed to update product',
          });

          this._isLoading.set(false);

          return throwError(() => err);
        }),
      );
  }

  deleteProduct({ productId }: { productId: number }) {
    return this.http.delete(`${this.baseUrl}/products/${productId}`).pipe(
      tap((res) => {
        this.toast.showToast({
          type: 'success',
          message: `Product ${productId} deleted successfully`,
        });
      }),
      catchError((err) => {
        this.toast.showToast({
          type: 'error',
          message: 'Failed to delete product',
        });

        return throwError(() => err);
      }),
    );
  }
}
