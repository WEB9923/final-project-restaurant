import { Component, inject, OnInit, signal } from '@angular/core';
import { Filters } from '../../components/shared/filters/filters';
import { ProductService } from '../../services/product-service';
import { Card } from '../../components/shared/card/card';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductFilter } from '../../interfaces/product-filter';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideFunnel,
  LucidePackageOpen,
} from '@lucide/angular';
import { Loader } from '../../components/ui/loader/loader';
import { SheetService } from '../../services/sheet-service';
import { Sheet } from '../../components/ui/sheet/sheet';
import { CartService } from '../../services/cart-service';
import { switchMap } from 'rxjs';
import { Select } from '../../components/shared/select/select';

@Component({
  selector: 'app-menu',
  imports: [
    Filters,
    Card,
    LucidePackageOpen,
    Loader,
    LucideFunnel,
    Sheet,
    Select,
    LucideChevronRight,
    LucideChevronLeft,
  ],
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
  take = signal<number>(10);
  page = signal<number>(1);

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

  updatePage(pageParam: string | undefined): boolean {
    const page = Number(pageParam);

    if (pageParam && (isNaN(page) || page < 1)) {
      this.router.navigate([], {
        queryParams: { page: null },
        queryParamsHandling: 'merge',
      });
      return false;
    }

    this.page.set(page >= 1 ? page : 1);
    return true;
  }

  nextPage(): void {
    this.router.navigate([], {
      queryParams: { page: this.page() + 1 },
      queryParamsHandling: 'merge',
    });
  }

  prevPage(): void {
    if (this.page() <= 1) return;

    this.router.navigate([], {
      queryParams: { page: this.page() - 1 },
      queryParamsHandling: 'merge',
    });
  }

  updateTake(take: number | null | string): void {
    this.router.navigate([], {
      queryParams: {
        take: take || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  updateTakeSignal(takeParam: string | undefined): void {
    const take = Number(takeParam);

    this.take.set(!takeParam || isNaN(take) || take < 1 ? 10 : take);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params): void => {
      if (!this.updatePage(params['page'])) return;
      this.updateTakeSignal(params['take']);

      this.currentFilters.set({
        search: params['search'] || undefined,
        categoryId: params['categoryId'] ? Number(params['categoryId']) : undefined,
        vegetarian: params['vegetarian'] === 'true' || params['vegetarian'] === true || false,
        minPrice: params['minPrice'] ? Number(params['minPrice']) : undefined,
        maxPrice: params['maxPrice'] ? Number(params['maxPrice']) : undefined,
        take: params['take'] ? Number(params['take']) : undefined,
        page: this.page(),
      });

      this.productService.fetchProducts(this.currentFilters()).subscribe();
    });
  }
}
