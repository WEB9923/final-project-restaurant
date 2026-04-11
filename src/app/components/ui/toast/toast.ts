import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { ToastService } from '../../../services/toast-service';
import { NgClass } from '@angular/common';
import { LucideX } from '@lucide/angular';
import gsap from 'gsap';

@Component({
  selector: 'app-toast',
  imports: [NgClass, LucideX],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  toast = inject(ToastService);

  toastElement = viewChild<ElementRef<HTMLElement>>('toastElement');

  constructor() {
    effect((): void => {
      const isVisibleToast = this.toast.show();
      const element = this.toastElement()?.nativeElement;

      if (isVisibleToast && element) {
        gsap.fromTo(
          element,
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.3, ease: 'power1.in' },
        );
      }
    });
  }

  closeToast(): void {
    const element = this.toastElement()?.nativeElement;

    if (element) {
      gsap.to(element, {
        x: 100,
        opacity: 0,
        duration: 0.3,
        ease: 'power1.in',
        onComplete: (): void => this.toast.hide(),
      });
    } else {
      this.toast.hide();
    }
  }
}
