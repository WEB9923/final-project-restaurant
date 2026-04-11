import { Injectable, signal } from '@angular/core';
import { LucideIcon } from '@lucide/angular';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private _icon = signal<LucideIcon | null>(null);
  private _title = signal<string>('');
  private _description = signal<string>('');
  private _show = signal<boolean>(false);
  private _actionText = signal<string>('');
  private _action = signal<(() => void) | null>(null);

  readonly title = this._title.asReadonly();
  readonly icon = this._icon.asReadonly();
  readonly description = this._description.asReadonly();
  readonly show = this._show.asReadonly();
  readonly actionText = this._actionText.asReadonly();

  open({
    icon,
    title,
    description,
    actionText,
    onAction,
  }: {
    icon?: LucideIcon;
    title: string;
    description?: string;
    actionText?: string;
    onAction?: () => void;
  }): void {
    this._icon.set(icon ?? null);
    this._title.set(title);
    this._description.set(description ?? '');
    this._actionText.set(actionText ?? '');
    this._action.set(onAction ?? null);

    this._show.set(true);
  }

  close(): void {
    this._show.set(false);
  }

  resetDetails(): void {
    this._icon.set(null);
    this._title.set('');
    this._description.set('');
    this._actionText.set('');
    this._action.set(null);
  }

  onAction(): void {
    const callback = this._action();

    if (callback) {
      callback();
    }

    this.close();
  }
}
