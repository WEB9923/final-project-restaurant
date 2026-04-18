import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product-service';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { LucideCircleDot, LucideLeaf, LucideStar } from '@lucide/angular';
import { Loader } from '../../components/ui/loader/loader';
import { Count } from '../../components/shared/count/count';
import { Card } from '../../components/shared/card/card';

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
  ],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {
  route = inject(ActivatedRoute);
  product = inject(ProductService);

  quantity = signal<number>(1);

  productId = toSignal(this.route.params, {
    initialValue: { id: null },
  });

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
  }
}
