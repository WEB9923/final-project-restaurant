import { AfterViewInit, Component, ElementRef, viewChild } from '@angular/core';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { Button } from '../../ui/button/button';

gsap.registerPlugin(SplitText);

@Component({
  selector: 'app-hero',
  imports: [Button],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements AfterViewInit {
  heroTitle = viewChild.required<ElementRef<HTMLHeadElement>>('heroTitle');
  heroText = viewChild.required<ElementRef<HTMLParagraphElement>>('heroText');
  herroButton = viewChild.required(Button, { read: ElementRef });

  ngAfterViewInit(): void {
    const title = this.heroTitle().nativeElement;
    const text = this.heroText().nativeElement;
    const button = this.herroButton().nativeElement;

    const splitTitle = new SplitText(title, { type: 'lines, chars' });
    const splitText = new SplitText(text, { type: 'chars' });

    const tl = gsap.timeline();

    tl.from(splitTitle.chars, {
      y: -60,
      opacity: 0,
      stagger: 0.04,
      duration: 0.4,
      delay: 0.4,
    })
      .from(
        splitText.chars,
        {
          y: 40,
          opacity: 0,
          duration: 0.4,
          stagger: 0.025,
          ease: 'power3.in',
        },
        '-=0.5',
      )
      .from(
        button,
        {
          y: 30,
          opacity: 0,
          duration: 0.4,
        },
        '-=0.5',
      );
  }
}
