import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { ProductModel, SingleProductModel } from '../models/product-model';
import { ProductFilter } from '../interfaces/product-filter';
import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  private baseUrl = environment.baseUrl;

  private _products = signal<ProductModel[]>([]);
  private _singleProduct = signal<SingleProductModel | null>(null);
  private _hasMore = signal<boolean>(false);
  private _page = signal<number>(1);
  private _isLoading = signal<boolean>(false);

  readonly products = this._products.asReadonly();
  readonly singleProduct = this._singleProduct.asReadonly();
  readonly hasMore = this._hasMore.asReadonly();
  readonly page = this._page.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  fetchProducts(filters: ProductFilter) {
    this._isLoading.set(true);

    const params: Record<string, any> = {
      Take: Number(filters.take ?? 8),
      Page: Number(filters.page ?? 1),
    };

    if (filters.search) params['Query'] = filters.search;
    if (filters.categoryId) params['CategoryId'] = Number(filters.categoryId);
    if (filters.vegetarian) params['Vegetarian'] = Boolean(filters.vegetarian);
    if (filters.minPrice) params['MinPrice'] = Number(filters.minPrice);
    if (filters.maxPrice) params['MaxPrice'] = Number(filters.maxPrice);

    return this.http
      .get<{
        data: {
          products: ProductModel[];
          hasMore: boolean;
        };
      }>(`${this.baseUrl}/products/filter`, { params })
      .pipe(
        tap(({ data }): void => {
          this._products.set(data.products);
          this._hasMore.set(data.hasMore);
          this._page.set(filters.page ?? 1);

          this._isLoading.set(false);
        }),
        catchError((err: HttpErrorResponse) => {
          this._isLoading.set(false);

          this.toast.showToast({
            message: err.error?.detail || 'Failed to load products',
            type: 'error',
          });

          return throwError(() => err);
        }),
      );
  }

  fetchProduct({ productId }: { productId: number }) {
    this._isLoading.set(true);

    this._singleProduct.set(null);

    return this.http
      .get<{ data: SingleProductModel }>(`${this.baseUrl}/products/${productId}`)
      .pipe(
        tap(({ data }): void => {
          this._singleProduct.set(data);

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
