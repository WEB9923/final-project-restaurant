import { AfterViewInit, Component, ElementRef, viewChild, viewChildren } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '../../ui/button/button';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-our-story',
  imports: [NgOptimizedImage, Button],
  template: `
    <section class="py-12 min-h-[50vh]">
      <div
        #trigger
        class="container-wrapper grid lg:grid-cols-[600px_1fr] md:grid-cols-[400px_1fr] gap-8 "
      >
        <div
          #ourStoryItem
          class="relative w-full h-100 rounded-radius overflow-hidden"
        >
          <img
            ngSrc="/restaurant-kitchen-chef-cooking.jpg"
            alt="image"
            fill
            class="object-cover"
          />
        </div>

        <div class="flex flex-col justify-center text-left space-y-4">
          <h2
            #ourStoryItem
            class="lg:text-3xl text-2xl font-bold"
          >
            Our Story
          </h2>
          <div
            #ourStoryItem
            class="text-muted-foreground space-y-3 font-medium lg:text-[18px] text-[16px]"
          >
            <p>
              At Foodie, we believe that great food brings people together. Our chefs use only the
              freshest ingredients to create dishes that delight your taste buds and warm your
              heart.
            </p>

            <p>
              From traditional recipes passed down through generations to innovative modern cuisine,
              every dish is crafted with passion and care. We're committed to delivering not just
              meals, but memorable dining experiences right to your door.
            </p>
          </div>

          <div #outStoryItem>
            <app-button
              label="Expore our menu"
              link="/menu"
              type="button"
              classNames="w-fit"
            />
          </div>
        </div>
      </div>
    </section>
  `,
})
export class OurStory implements AfterViewInit {
  trigger = viewChild.required<ElementRef<HTMLElement>>('trigger');
  ourStoryItems = viewChildren<ElementRef<HTMLElement>>('ourStoryItem');

  ngAfterViewInit(): void {
    const items = this.ourStoryItems().map((item) => item.nativeElement);

    gsap.from(items, {
      opacity: 0,
      y: 40,
      duration: 0.4,
      stagger: 0.15,

      scrollTrigger: {
        trigger: this.trigger().nativeElement,
        start: 'top 60%',
        // markers: true,
      },
    });
  }
}
