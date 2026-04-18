import { Component, DOCUMENT, effect, ElementRef, inject, viewChild } from '@angular/core';
import gsap from 'gsap';
import { SheetService } from '../../../services/sheet-service';
import { LucideX } from '@lucide/angular';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-sheet',
  imports: [LucideX],
  template: `
    @if (sheet.isSheetOpen()) {
      <aside
        #sidebar
        class="fixed -left-full opacity-0 lg:hidden top-17.5 bottom-0 h-[calc(100vh-70px)] bg-card border-r-2 border-border md:w-87.5 sm:w-82 min-[450px]:w-76 w-full p-4"
      >
        <header class="flex items-center justify-between">
          <h2 class="text-2xl font-bold">{{ sheet.title() }}</h2>
          <button
            class="btn-icon"
            (click)="closeSheet()"
          >
            <svg
              lucideX
              [size]="20"
            ></svg>
          </button>
        </header>

        <div class="mt-8 h-full overflow-y-auto">
          <ng-content></ng-content>
        </div>
      </aside>
    }
  `,
})
export class Sheet {
  sheet = inject(SheetService);
  document = inject(DOCUMENT);

  sidebar = viewChild<ElementRef<HTMLElement>>('sidebar');

  constructor() {
    effect((): void => {
      const isVisibleSidebar = this.sheet.isSheetOpen();
      const sidebarElement = this.sidebar()?.nativeElement;

      if (isVisibleSidebar && sidebarElement) {
        gsap.to(sidebarElement, {
          left: 0,
          duration: 0.5,
          ease: 'expo.out',
          opacity: 1,
        });
      }
    });

    effect((onCleanup): void => {
      if (!this.sheet.isSheetOpen()) return;

      const sub = fromEvent<MouseEvent>(this.document, 'click').subscribe((event): void => {
        const sidebarElement = this.sidebar()?.nativeElement;

        if (!sidebarElement) return;

        if (!sidebarElement.contains(event.target as Node)) {
          this.closeSheet();
        }
      });

      onCleanup((): void => sub.unsubscribe());
    });
  }

  closeSheet(): void {
    const sidebarElement = this.sidebar()?.nativeElement;

    if (sidebarElement) {
      gsap.to(sidebarElement, {
        left: '-100%',
        duration: 0.5,
        ease: 'expo.in',
        opacity: 0,

        onComplete: () => this.sheet.close(),
      });
    }
  }
}
