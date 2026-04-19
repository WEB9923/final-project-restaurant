import { Component, effect, ElementRef, input, model, signal, viewChild } from '@angular/core';
import { LucideChevronDown } from '@lucide/angular';
import gsap from 'gsap';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-select',
  imports: [LucideChevronDown, NgClass],
  template: `
    <div
      class="relative w-48"
      [ngClass]="classes()"
    >
      <button
        #trigger
        (click)="toggle()"
        type="button"
        class="btn-bordered w-full text-sm! font-semibold! text-foreground! flex! items-center! justify-between!"
      >
        <span>{{ selectedLabel() }}</span>
        <svg
          lucideChevronDown
          [size]="20"
          class="duration-200 transition-all"
          [ngClass]="{
            'rotate-180': isOpen(),
          }"
        ></svg>
      </button>

      <div
        #dropdown
        class="absolute invisible opacity-0 pointer-events-none top-full left-0 mt-1 w-full border-2 border-border rounded-radius p-1 z-50 bg-background"
      >
        @for (option of options(); track option.value) {
          <button
            (click)="select(option)"
            class="w-full text-left px-2 py-1.5 font-medium! cursor-pointer text-sm rounded-radius hover:bg-accent"
            [ngClass]="{
              'bg-accent text-primary': option.value === value(),
            }"
          >
            {{ option.label }}
          </button>
        }
      </div>
    </div>
  `,
})
export class Select {
  options = input<ISelectOption[]>([]);
  value = model<string | number | null>(null);
  classes = input<string>('');

  isOpen = signal<boolean>(false);

  trigger = viewChild.required<ElementRef<HTMLElement>>('trigger');
  dropdown = viewChild.required<ElementRef<HTMLElement>>('dropdown');

  toggle(): void {
    this.isOpen.update((o) => !o);
  }

  select(option: ISelectOption) {
    this.value.set(option.value);
    this.isOpen.set(false);
  }

  selectedLabel(): string {
    const found = this.options().find((op) => op.value === this.value());

    return found?.label ?? 'Select..';
  }

  constructor() {
    effect((): void => {
      const isOpen = this.isOpen();

      const element = this.dropdown().nativeElement;

      if (!element) return;

      if (isOpen) {
        gsap.fromTo(
          element,
          {
            y: -20,
            autoAlpha: 0,
          },
          { y: 0, autoAlpha: 1, duration: 0.2, pointerEvents: 'auto' },
        );
      } else {
        gsap.to(element, {
          y: -10,
          autoAlpha: 0,
          duration: 0.15,
          pointerEvents: 'none',
        });
      }
    });
  }
}

interface ISelectOption {
  label: string;
  value: string | number;
}
