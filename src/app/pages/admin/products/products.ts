import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../../../services/product-service';
import { Button } from '../../../components/ui/button/button';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Separator } from '../../../components/ui/separator/separator';
import { Loader } from '../../../components/ui/loader/loader';
import { LucidePencil, LucideTrash } from '@lucide/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [Button, NgOptimizedImage, Separator, CurrencyPipe, Loader],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  router = inject(Router);
  route = inject(ActivatedRoute);
  productsService = inject(ProductService);

  protected readonly LucidePencil = LucidePencil;
  protected readonly LucideTrash = LucideTrash;

  page = signal<number>(1);

  updatePage(pageParam: string | undefined) {
    const pg = Number(pageParam);

    if ((pageParam && isNaN(pg)) || pg < 1) {
      this.router.navigate([], {
        queryParams: { page: null },
        queryParamsHandling: 'merge',
      });

      return false;
    }

    this.page.set(pg >= 1 ? pg : 1);
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

  ngOnInit(): void {
    this.route.queryParams.subscribe((params): void => {
      if (!this.updatePage(params['page'])) return;

      this.productsService.fetchProducts({ take: 10, page: this.page() }).subscribe();
    });
  }
}
