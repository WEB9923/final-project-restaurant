import { Component, input, model, output } from '@angular/core';
import { LucideMinus, LucidePlus } from '@lucide/angular';

@Component({
  selector: 'app-count',
  imports: [LucideMinus, LucidePlus],
  template: `
    <div
      class="flex items-center border-2 border-border max-w-28 h-9 rounded-radius justify-between w-full"
    >
      <button
        (click)="dec()"
        type="button"
        class="btn-icon hover:bg-input/60"
      >
        <svg
          lucideMinus
          [size]="18"
        ></svg>
      </button>
      <p class="shrink-0 text-[15px] select-none text-foreground font-semibold">{{ value() }}</p>
      <button
        (click)="inc()"
        type="button"
        class="btn-icon hover:bg-input/60"
      >
        <svg
          lucidePlus
          [size]="18"
        ></svg>
      </button>
    </div>
  `,
})
export class Count {
  value = input<number>(1);
  valueChange = output<number>();

  inc(): void {
    this.valueChange.emit(this.value() + 1);
  }

  dec(): void {
    if (this.value() > 1) {
      this.valueChange.emit(this.value() - 1);
    }
  }
}
