import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private baseUrl = environment.baseUrl;
  private httpClient = inject(HttpClient);

  // categories
  getCategories<T>(): Observable<T> {
    return this.httpClient.get<T>(`${this.baseUrl}/categories`);
  }

  getProducts<T>({ param, queryParams }: { param?: string; queryParams?: string }): Observable<T> {
    return this.httpClient.get<T>(`${this.baseUrl}/products${param ? param : ''}${queryParams}`);
  }
}
