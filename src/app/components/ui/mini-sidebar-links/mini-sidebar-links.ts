import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { LucideChevronRight } from '@lucide/angular';
import gsap from 'gsap';

@Component({
  selector: 'app-mini-sidebar-links',
  imports: [LucideChevronRight],
  template: `
    <div
      #barRef
      class="fixed -left-11 top-1/2"
    >
      <div class="w-11 bg-accent flex items-center justify-center h-13">
        <a
          href="https://t.me/stepacademyrestaurant_bot"
          target="_blank"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="27"
            height="27"
            fill="#1187C2"
            class="bi bi-telegram hover:opacity-90"
            viewBox="0 0 16 16"
          >
            <path
              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"
            />
          </svg>
        </a>
        <button
          (click)="toggleBar()"
          class="absolute left-11 bg-accent h-10 rounded-tr-radius rounded-br-radius text-muted-foreground cursor-pointer
"
        >
          <div #chevronIconRef>
            <svg
              lucideChevronRight
              [size]="20"
            ></svg>
          </div>
        </button>
      </div>
    </div>
  `,
})
export class MiniSidebarLinks {
  barRef = viewChild.required<ElementRef<HTMLElement>>('barRef');
  chevronIconRef = viewChild.required<ElementRef<SVGElement>>('chevronIconRef');

  isOpen = signal<boolean>(false);

  toggleBar(): void {
    const barElement = this.barRef().nativeElement;
    const chevronIconElement = this.chevronIconRef().nativeElement;

    this.isOpen.update((prevState): boolean => !prevState);

    if (this.isOpen()) {
      gsap.to(barElement, { x: 44, duration: 0.2 });
      gsap.to(chevronIconElement, { rotation: 180, duration: 0.3, delay: 0.07 });
    } else {
      gsap.to(barElement, { x: 0, duration: 0.2 });
      gsap.to(chevronIconElement, { rotation: 0, duration: 0.3 });
    }
  }
}
