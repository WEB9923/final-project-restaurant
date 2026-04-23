import { Component, inject, input, output, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ProductModel } from '../../../models/product-model';
import { RouterLink } from '@angular/router';
import { LucideStar } from '@lucide/angular';
import { UtilsService } from '../../../services/utils-service';
import { Button } from '../../ui/button/button';

@Component({
  selector: 'app-card',
  imports: [NgOptimizedImage, RouterLink, LucideStar, Button],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  utils = inject(UtilsService);

  isLoading = signal<boolean>(false);

  product = input.required<ProductModel>();
  addToCart = output<{ id: number; done: () => void }>();

  onAddToCart(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.isLoading.set(true);

    this.addToCart.emit({
      id: this.product().id,
      done: (): void => this.isLoading.set(false),
    });
  }
}
