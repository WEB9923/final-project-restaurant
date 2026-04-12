import { Component, inject, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ProductModel } from '../../../models/product-model';
import { RouterLink } from '@angular/router';
import { LucideStar } from '@lucide/angular';
import { UtilsService } from '../../../services/utils-service';

@Component({
  selector: 'app-card',
  imports: [NgOptimizedImage, RouterLink, LucideStar],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  utils = inject(UtilsService);

  product = input.required<ProductModel>();
  addToCart = output<number>();

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.addToCart.emit(this.product().id);
  }
}
