import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatBotService {
  private http = inject(HttpClient);

  private _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  private readonly apiUrl =
    'https://amikos-space.app.n8n.cloud/webhook/48e75ce1-9f80-4208-89da-ecc5e2e6ab63/chat';

  askAI({ chatInput, sessionId }: { chatInput: string; sessionId: string }) {
    this._isLoading.set(true);
    return this.http
      .post<{ output: string; message: string }>(this.apiUrl, { chatInput, sessionId })
      .pipe(
        tap((res) => {
          this._isLoading.set(false);
        }),
        catchError((err) => {
          this._isLoading.set(false);

          return throwError(() => err);
        }),
      );
  }
}
