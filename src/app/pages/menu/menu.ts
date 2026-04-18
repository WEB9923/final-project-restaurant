import { Component, inject, OnInit, signal } from '@angular/core';
import { Filters } from '../../components/shared/filters/filters';
import { ProductService } from '../../services/product-service';
import { Card } from '../../components/shared/card/card';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductFilter } from '../../interfaces/product-filter';
import { LucideFunnel, LucidePackageOpen } from '@lucide/angular';
import { Loader } from '../../components/ui/loader/loader';
import { SheetService } from '../../services/sheet-service';
import { Sheet } from '../../components/ui/sheet/sheet';
import { CartService } from '../../services/cart-service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-menu',
  imports: [Filters, Card, LucidePackageOpen, Loader, LucideFunnel, Sheet],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  productService = inject(ProductService);
  sheet = inject(SheetService);
  cart = inject(CartService);

  currentFilters = signal<ProductFilter | {}>({});

  handleAddToCart(id: number, done: () => void): void {
    this.cart
      .addToCart({ quantity: 1, productId: id })
      .pipe(switchMap(() => this.cart.fetchCartProducts({ showLoader: false })))
      .subscribe({
        next: (): void => done(),
        error: (): void => done(),
      });
  }

  openFiltersSheet(): void {
    this.sheet.open({ title: 'Filters' });
  }

  onFiltersChanged(filters: ProductFilter): void {
    this.router.navigate([], {
      queryParams: {
        search: filters.search || null,
        categoryId: filters.categoryId || null,
        vegetarian: filters.vegetarian || null,
        minPrice: filters.minPrice || null,
        maxPrice: filters.maxPrice || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params): void => {
      this.currentFilters.set({
        search: params['search'] || undefined,
        categoryId: params['categoryId'] ? Number(params['categoryId']) : undefined,
        vegetarian: params['vegetarian'] === 'true' || params['vegetarian'] === true || false,
        minPrice: params['minPrice'] ? Number(params['minPrice']) : undefined,
        maxPrice: params['maxPrice'] ? Number(params['maxPrice']) : undefined,
        // page: params['page'] ? Number(params['page']) : 1,
      });

      this.productService.fetchProducts(this.currentFilters()).subscribe();
    });
  }
}
