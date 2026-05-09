import { Component, computed, inject, signal } from '@angular/core';
import { ProductService } from '../../../services/product-service';
import { Button } from '../../../components/ui/button/button';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Separator } from '../../../components/ui/separator/separator';
import { Loader } from '../../../components/ui/loader/loader';
import { LucidePencil, LucideTrash, LucideX } from '@lucide/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Sheet } from '../../../components/ui/sheet/sheet';
import { SheetService } from '../../../services/sheet-service';
import { Select } from '../../../components/shared/select/select';
import { CategoriesService } from '../../../services/categories-service';
import { Switch } from '../../../components/ui/switch/switch';
import { CreateProductModel } from '../../../models/admin/create-product-model';
import { form, FormField, validateStandardSchema } from '@angular/forms/signals';
import { createProductSchema } from '../../../schemas/admin/create-product-schema';
import { InvalidInput } from '../../../directives/invalid-input';

@Component({
  selector: 'app-products',
  imports: [
    Button,
    NgOptimizedImage,
    Separator,
    CurrencyPipe,
    Loader,
    Sheet,
    Select,
    Switch,
    FormField,
    InvalidInput,
    LucideX,
  ],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  router = inject(Router);
  route = inject(ActivatedRoute);
  productsService = inject(ProductService);
  sheetService = inject(SheetService);
  categoriesService = inject(CategoriesService);

  protected readonly LucidePencil = LucidePencil;
  protected readonly LucideTrash = LucideTrash;

  page = signal<number>(1);

  createProductModel = signal<CreateProductModel>({
    name: '',
    description: '',
    image: '',
    categoryId: null,
    ingredients: [],
    method: '',
    price: 0,
    spiciness: null,
    vegetarian: false,
  });

  categoryOptions = computed(() => {
    return this.categoriesService.categories().map((cat) => ({
      label: cat.name,
      value: cat.id,
    }));
  });

  createProductForm = form(this.createProductModel, (path) =>
    validateStandardSchema(path, createProductSchema),
  );

  addIngredient(input: HTMLInputElement): void {
    const { value } = input;

    if (!value) return;

    this.createProductModel.update((m) => ({
      ...m,
      ingredients: [...m.ingredients, value.trim()],
    }));

    input.value = '';
  }

  removeIngredient(index: number): void {
    this.createProductModel.update((m) => ({
      ...m,
      ingredients: m.ingredients.filter((_, i) => i !== index),
    }));
  }

  createProduct(evt: SubmitEvent): void {
    evt.preventDefault();

    this.createProductForm.ingredients().markAsTouched();
    this.createProductForm.method().markAsTouched();
    this.createProductForm.categoryId().markAsTouched();
    this.createProductForm.spiciness().markAsTouched();
    this.createProductForm.description().markAsTouched();
    this.createProductForm.price().markAsTouched();
    this.createProductForm.image().markAsTouched();
    this.createProductForm.name().markAsTouched();

    if (this.createProductForm().invalid()) return;

    console.log(this.createProductModel());
  }

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

  openNewProductSheet(): void {
    this.sheetService.open();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params): void => {
      if (!this.updatePage(params['page'])) return;

      this.productsService.fetchProducts({ take: 10, page: this.page() }).subscribe();
    });
  }
}
