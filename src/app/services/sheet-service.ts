import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SheetService {
  private _isSheetOpen = signal<boolean>(false);
  private _title = signal<string>('');

  readonly isSheetOpen = this._isSheetOpen.asReadonly();
  readonly title = this._title.asReadonly();

  open({ title }: { title: string }): void {
    this._title.set(title);

    this._isSheetOpen.set(true);
  }

  close(): void {
    this._isSheetOpen.set(false);

    this._title.set('');
  }
}
