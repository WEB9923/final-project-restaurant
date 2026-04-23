import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { Switch } from '../../ui/switch/switch';
import { FormsModule } from '@angular/forms';
import { ProductFilter } from '../../../interfaces/product-filter';
import { CategoriesService } from '../../../services/categories-service';
import { Loader } from '../../ui/loader/loader';
import { Button } from '../../ui/button/button';

@Component({
  selector: 'app-filters',
  imports: [Switch, FormsModule, Loader, Button],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters implements OnInit {
  categoriesService = inject(CategoriesService);

  currentFilters = input<ProductFilter>();
  filtersChanged = output<ProductFilter>();

  searchValue: string = '';
  selectedCategoryId: number | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  isVegetarian = signal<boolean>(false);

  onChange(): void {
    this.emit();
  }

  private emit(): void {
    this.filtersChanged.emit({
      search: this.searchValue || undefined,
      categoryId: this.selectedCategoryId ?? undefined,
      vegetarian: this.isVegetarian() || undefined,
      minPrice: this.minPrice || undefined,
      maxPrice: this.maxPrice || undefined,
    });
  }

  clearAll() {
    this.searchValue = '';
    this.selectedCategoryId = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.isVegetarian.set(false);

    this.filtersChanged.emit({
      search: undefined,
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      vegetarian: undefined,
    });
  }

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe();
  }

  constructor() {
    effect((): void => {
      const filters = this.currentFilters();

      if (filters?.search) this.searchValue = filters.search;
      if (filters?.categoryId) this.selectedCategoryId = filters.categoryId;
      if (filters?.vegetarian) this.isVegetarian.set(filters.vegetarian);
    });
  }
}
