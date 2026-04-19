import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product-service';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { LucideCircleDot, LucideLeaf, LucideLoader, LucideStar } from '@lucide/angular';
import { Loader } from '../../components/ui/loader/loader';
import { Count } from '../../components/shared/count/count';
import { Card } from '../../components/shared/card/card';
import { CartService } from '../../services/cart-service';
import { switchMap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-product',
  imports: [
    NgOptimizedImage,
    LucideStar,
    CurrencyPipe,
    LucideLeaf,
    Loader,
    LucideCircleDot,
    Count,
    Card,
    LucideLoader,
  ],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {
  route = inject(ActivatedRoute);
  title = inject(Title);
  product = inject(ProductService);
  cart = inject(CartService);

  quantity = signal<number>(1);
  isLoading = signal<boolean>(false);

  productId = toSignal(this.route.params, {
    initialValue: { id: null },
  });

  handleAddToCart(): void {
    const id = +this.productId().id;

    if (!id) return;

    this.isLoading.set(true);

    this.cart
      .addToCart({ productId: id, quantity: this.quantity() })
      .pipe(switchMap(() => this.cart.fetchCartProducts({ showLoader: false })))
      .subscribe({
        next: (): void => this.isLoading.set(false),
        error: (): void => this.isLoading.set(false),
      });
  }

  handleAddSingleProduct(id: number, done: () => void): void {
    this.cart
      .addToCart({ productId: id, quantity: 1 })
      .pipe(switchMap(() => this.cart.fetchCartProducts({ showLoader: false })))
      .subscribe({
        next: (): void => done(),
        error: (): void => done(),
      });
  }

  constructor() {
    effect((): void => {
      const id: number = +this.productId().id;

      if (!id) return;

      this.product.fetchProduct({ productId: id }).subscribe();
    });

    effect((): void => {
      const product = this.product.singleProduct();

      if (!product?.categoryId) return;

      this.product.fetchProducts({ categoryId: product.categoryId, take: 4 }).subscribe();
    });

    effect((): void => {
      const product = this.product.singleProduct();

      if (!product) return;

      this.title.setTitle(`Foodie | ${product.name}`);
    });
  }
}
