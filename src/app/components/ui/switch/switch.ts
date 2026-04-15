import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-switch',
  imports: [],
  template: `
    <input
      [id]="id()"
      [checked]="checked()"
      (change)="onToggle($event)"
      type="checkbox"
      class="appearance-none w-9 h-5 checked:before:left-[calc(36px-16px-3px)] before:transition-all checked:bg-primary checked:before:bg-primary-foreground transition-all rounded-full bg-input relative before:absolute before:w-4 before:h-4 before:rounded-full before:bg-foreground before:top-1/2 before:-translate-y-1/2 before:left-0.75"
    />
  `,
})
export class Switch {
  id = input.required<string>();

  checked = model.required<boolean>();

  onToggle(event: Event): void {
    this.checked.set((event.target as HTMLInputElement).checked);
  }
}
