import { Component, computed, inject, input, output } from '@angular/core';
import { LucideLoader } from '@lucide/angular';
import { Router } from '@angular/router';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const variants: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/75',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/75',
  outline: 'border border-border bg-background hover:bg-secondary/75',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/75',
  ghost: 'bg-transparent hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-3 hover:underline',
};

const sizes: Record<ButtonSize, string> = {
  default: 'h-9 px-2',
  sm: 'h-8 px-1.5 text-sm',
  lg: 'h-10 px-3',
  icon: 'h-9 w-9',
};

const base = [
  'inline-flex items-center justify-center gap-2',
  'rounded-radius font-medium cursor-pointer capitalize',
  'disabled:pointer-events-none disabled:opacity-60',
  '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
].join(' ');

@Component({
  selector: 'app-button',
  imports: [LucideLoader],
  template: `
    <button
      [class]="classes()"
      [type]="type()"
      [disabled]="disabled() || loading()"
      (click)="handleClick($event)"
    >
      @if (loading()) {
        <svg
          lucideLoader
          [size]="20"
          class="animate-spin"
        ></svg>
        <span>{{ loadingText() }}</span>
      } @else {
        <ng-content>{{ label() }}</ng-content>
      }
    </button>
  `,
})
export class Button {
  router = inject(Router);

  label = input<string>('');
  variant = input<ButtonVariant>('default');
  size = input<ButtonSize>('default');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  loadingText = input<string>('Please wait...');
  classNames = input<string>('');

  link = input<string | any[] | null>(null);
  replaceUrl = input<true | false>(false);

  clicked = output<MouseEvent>();

  classes = computed((): string => {
    return [base, variants[this.variant()], sizes[this.size()], this.classNames()].join(' ');
  });

  handleClick(event: MouseEvent): void {
    if (this.disabled() || this.loading()) return;

    if (this.link()) {
      event?.preventDefault();
      event.stopPropagation();
      this.router.navigate([this.link()], { replaceUrl: this.replaceUrl() });
      return;
    }

    this.clicked.emit(event);
  }
}
