import { Component } from '@angular/core';
import { LucideLoader } from '@lucide/angular';

@Component({
  selector: 'app-loader',
  imports: [LucideLoader],
  template: `
    <div class="flex items-center gap-2 text-foreground">
      <svg
        lucideLoader
        [size]="25"
        class="animate-spin"
        [strokeWidth]="3"
      ></svg>
      <span class="text-[19px] font-bold">Please wait</span>
    </div>
  `,
})
export class Loader {}
