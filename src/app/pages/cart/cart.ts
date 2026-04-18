import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart-service';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Count } from '../../components/shared/count/count';
import { LucideShoppingBag, LucideTrash2 } from '@lucide/angular';
import { Loader } from '../../components/ui/loader/loader';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [
    NgOptimizedImage,
    Count,
    LucideTrash2,
    CurrencyPipe,
    LucideShoppingBag,
    Loader,
    RouterLink,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cart = inject(CartService);

  totalPricePerProduct() {
    return;
  }
}
