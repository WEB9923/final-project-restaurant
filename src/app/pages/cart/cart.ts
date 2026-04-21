import { Component, computed, inject } from '@angular/core';
import { CartService } from '../../services/cart-service';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Count } from '../../components/shared/count/count';
import { LucideShoppingBag, LucideTrash2 } from '@lucide/angular';
import { Loader } from '../../components/ui/loader/loader';
import { RouterLink } from '@angular/router';
import { DialogService } from '../../services/dialog-service';
import { switchMap } from 'rxjs';

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
  dialog = inject(DialogService);

  subtotal = computed((): number => this.cart.cartProducts()?.totalPrice ?? 0);

  tax = computed((): number => this.subtotal() * 0.1);

  total = computed((): number => this.subtotal() + this.tax());

  openDialog({ itemId }: { itemId: number }): void {
    this.dialog.open({
      title: 'Remove item?',
      description: 'Are you sure you want to remove this item from your cart?',
      actionText: 'Remove',
      onAction: (): void => {
        this.handleDeleteCartItem({ itemId });
      },
    });
  }

  updateQuantity(itemId: number, quantity: number): void {
    this.cart
      .updateQuantity({ itemId, quantity })
      .pipe(switchMap(() => this.cart.fetchCartProducts({ showLoader: false })))
      .subscribe();
  }

  handleDeleteCartItem({ itemId }: { itemId: number }): void {
    this.cart
      .deleteCartItem({ itemId })
      .pipe(switchMap(() => this.cart.fetchCartProducts({ showLoader: false })))
      .subscribe({
        next: (): void => {
          this.dialog.close();
        },
      });
  }

  handleCheckout(): void {
    this.cart
      .checkout({})
      .pipe(switchMap(() => this.cart.fetchCartProducts({ showLoader: true })))
      .subscribe();
  }
}
