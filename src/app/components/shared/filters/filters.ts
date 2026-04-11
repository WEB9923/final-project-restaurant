import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CategoriesModel } from '../../../models/categories-model';
import { HttpService } from '../../../services/http-service';
import { LucideCheck } from '@lucide/angular';

@Component({
  selector: 'app-filters',
  imports: [LucideCheck],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters implements OnInit {
  http = inject(HttpService);

  categories = signal<CategoriesModel[]>([]);

  ngOnInit(): void {
    this.http.getCategories<{ data: CategoriesModel[] }>().subscribe({
      next: ({ data }): void => {
        this.categories.set(data);
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  constructor() {
    effect((): void => {
      console.log(this.categories());
    });
  }
}
