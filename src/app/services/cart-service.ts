import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  private baseUrl = environment.baseUrl;

  private _cartProducts = signal(null);
  private _isLoading = signal<boolean>(false);

  readonly cartProducts = this._cartProducts.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  addToCart({ quantity, productId }: { quantity: number; productId: number }) {
    return this.http
      .post<{ isSuccess: boolean }>(`${this.baseUrl}/cart/add-to-cart`, { productId, quantity })
      .pipe(
        tap(({ isSuccess }): void => {
          if (isSuccess) {
            this.toast.showToast({
              message: `Product with id - ${productId} added to cart successfully`,
              type: 'success',
            });
          }
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.toast.showToast({
              message: 'Please login first to add to cart',
              type: 'error',
            });
          } else {
            this.toast.showToast({
              message: err.error?.detail || 'Failed add to cart product',
              type: 'error',
            });
          }

          return throwError(() => err);
        }),
      );
  }
}
