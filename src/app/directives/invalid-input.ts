import { Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

@Directive({
  selector: '[appInvalidInput]',
  host: {},
})
export class InvalidInput<T> {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  field = input.required<FieldTree<T>>();

  constructor() {
    effect((): void => {
      const field = this.field();

      const isInvalid = field().touched() && field().invalid();

      if (isInvalid) {
        this.renderer.addClass(this.el.nativeElement, 'border!');
        this.renderer.addClass(this.el.nativeElement, 'border-destructive!');
      } else {
        this.renderer.removeClass(this.el.nativeElement, 'border!');
        this.renderer.removeClass(this.el.nativeElement, 'border-destructive!');
      }
    });
  }
}
