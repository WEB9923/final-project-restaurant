import { Injectable, signal } from '@angular/core';

type ToastType = 'success' | 'info' | 'warning' | 'error' | 'default';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _message = signal<string>('');
  private _toastType = signal<ToastType>('warning');
  private _show = signal<boolean>(false);
  private _showClose = signal<boolean>(true);

  readonly message = this._message.asReadonly();
  readonly toastType = this._toastType.asReadonly();
  readonly show = this._show.asReadonly();
  readonly showClose = this._showClose.asReadonly();

  private timeoutId: ReturnType<typeof setTimeout> | undefined;

  showToast({
    message,
    type = 'default',
    time = 3000,
    showClose = true,
  }: {
    message: string;
    type?: ToastType;
    time?: number;
    showClose?: boolean;
  }): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);

    this._message.set(message);
    this._toastType.set(type);
    this._showClose.set(showClose);
    this._show.set(true);

    setTimeout((): void => this._show.set(false), time);
  }

  hide(): void {
    this._show.set(false);

    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = undefined;
  }
}
