import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { HttpService } from '../../../services/http-service';
import { ProductModel } from '../../../models/product-model';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card } from '../card/card';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-popular-dishes',
  imports: [Card],
  templateUrl: './popular-dishes.html',
  styleUrl: './popular-dishes.css',
})
export class PopularDishes implements OnInit, AfterViewInit {
  http = inject(HttpService);

  products = signal<ProductModel[]>([]);

  productCards = viewChildren(Card, { read: ElementRef });
  popularDishesTitle = viewChild.required<ElementRef<HTMLHeadElement>>('popularDishesTitle');

  handleAddToCart(event: number): void {
    console.log(event);
  }

  constructor() {
    effect((): void => {
      const productElements = this.productCards().map((item) => item.nativeElement);

      for (let i = 0; i < productElements.length; i += 1) {
        gsap.from(productElements[i], {
          y: 60,
          opacity: 0,
          stagger: 0.2,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: productElements[i],
            start: 'top 85%',
          },
        });
      }
    });
  }

  ngAfterViewInit(): void {
    gsap.from(this.popularDishesTitle().nativeElement, {
      y: 50,
      opacity: 0,
      duration: 0.5,
    });
  }

  ngOnInit(): void {
    this.http
      .getProducts<{ data: { products: ProductModel[] } }>({ queryParams: '?Take=6&Page=1' })
      .subscribe({
        next: ({ data: { products } }): void => {
          this.products.set(products);
        },
        error: (error): void => {
          console.log(error);
        },
      });
  }
}
