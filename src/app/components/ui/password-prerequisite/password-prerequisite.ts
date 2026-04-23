import { Component } from '@angular/core';
import { LucideCircleDot } from '@lucide/angular';

@Component({
  selector: 'app-password-prerequisite',
  imports: [LucideCircleDot],
  template: `
    <div class="flex flex-col mt-2 gap-0.5">
      @for (
        item of [
          ' At least 8 characters',
          'Uppercase and lowercase letters',
          'At least one number',
        ];
        track $index
      ) {
        <p class="flex items-center text-muted-foreground gap-0.5 select-none">
          <svg
            lucideCircleDot
            [size]="15"
            [strokeWidth]="3"
            class="p-0!"
          ></svg>
          <span class="text-[13px]">{{ item }}</span>
        </p>
      }
    </div>
  `,
})
export class PasswordPrerequisite {}
