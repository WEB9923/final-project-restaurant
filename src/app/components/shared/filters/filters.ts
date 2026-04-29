import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { Switch } from '../../ui/switch/switch';
import { FormsModule } from '@angular/forms';
import { ProductFilter } from '../../../interfaces/product-filter';
import { CategoriesService } from '../../../services/categories-service';
import { Loader } from '../../ui/loader/loader';
import { Button } from '../../ui/button/button';
import { Select } from '../select/select';

@Component({
  selector: 'app-filters',
  imports: [Switch, FormsModule, Loader, Button, Select],
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
  spiciness = signal<number | null>(null);

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
      spiciness: this.spiciness() || undefined,
    });
  }

  clearAll() {
    this.searchValue = '';
    this.selectedCategoryId = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.isVegetarian.set(false);
    this.spiciness.set(null);

    this.filtersChanged.emit({
      search: undefined,
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      vegetarian: undefined,
      spiciness: undefined,
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
      if (filters?.spiciness) this.spiciness.set(filters.spiciness);

      if (filters?.minPrice) this.minPrice = filters.minPrice;
      if (filters?.maxPrice) this.maxPrice = filters.maxPrice;
    });
  }
}
