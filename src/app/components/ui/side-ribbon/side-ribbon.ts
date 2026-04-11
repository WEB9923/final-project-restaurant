import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-side-ribbon',
  imports: [NgClass],
  template: `
    <div
      [ngClass]="classes()"
      class="[writing-mode:sideways-lr] text-sm px-2 py-0.5 bg-accent font-semibold text-primary absolute left-0 top-0"
    >
      {{ text() }}
    </div>
  `,
})
export class SideRibbon {
  text = input.required<string>();

  classes = input<string>('rounded-tr-0 rounded-br-radius rounded-tl-md');
}
