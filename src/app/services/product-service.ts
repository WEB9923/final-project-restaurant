import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { ProductModel } from '../models/product-model';
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
  private _hasMore = signal<boolean>(false);
  private _page = signal<number>(1);
  private _isLoading = signal<boolean>(false);

  readonly products = this._products.asReadonly();
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
    if (filters.categoryId) params['CategoryId'] = filters.categoryId;
    if (filters.vegetarian) params['Vegetarian'] = Boolean(filters.vegetarian);
    if (filters.minPrice) params['MinPrice'] = filters.minPrice;
    if (filters.maxPrice) params['MaxPrice'] = filters.maxPrice;

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
        catchError((err) => {
          this._isLoading.set(false);

          this.toast.showToast({
            message: err.error?.detail || 'Failed to load products',
            type: 'error',
          });

          return throwError(() => err);
        }),
      );
  }
}
