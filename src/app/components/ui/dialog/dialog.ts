import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { DialogService } from '../../../services/dialog-service';
import { LucideX } from '@lucide/angular';
import { Separator } from '../separator/separator';
import gsap from 'gsap';
import { Button } from '../button/button';

@Component({
  selector: 'app-dialog',
  imports: [LucideX, Separator, Button],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
})
export class Dialog {
  dialog = inject(DialogService);

  dialogOverlay = viewChild<ElementRef<HTMLDivElement>>('dialogOverlay');
  dialogElement = viewChild<ElementRef<HTMLDivElement>>('dialogElement');

  onClose(): void {
    const overlay = this.dialogOverlay();
    const element = this.dialogElement();

    if (!overlay || !element) return;

    const tl = gsap.timeline();

    tl.to(element.nativeElement, {
      scaleX: 0,
      duration: 0.3,
      autoAlpha: 0,
    }).to(
      overlay.nativeElement,
      {
        autoAlpha: 0,
        duration: 0.3,
        scaleY: 0,
        onComplete: (): void => {
          this.dialog.resetDetails();
          this.dialog.close();
        },
      },
      '+=0.1',
    );
  }

  constructor() {
    effect((): void => {
      const isVisible = this.dialog.show();
      const overlay = this.dialogOverlay();
      const element = this.dialogElement();

      if (isVisible && overlay && element) {
        const tl = gsap.timeline();

        tl.from(overlay.nativeElement, {
          autoAlpha: 1,
          duration: 0.3,
          scaleY: 0.1,
        }).to(
          element.nativeElement,
          {
            scaleX: 1,
            duration: 0.3,
            autoAlpha: 1,
          },
          '+=0.15',
        );
      }
    });
  }
}
