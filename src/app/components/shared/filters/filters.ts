import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CategoriesModel } from '../../../models/categories-model';
import { HttpService } from '../../../services/http-service';

@Component({
  selector: 'app-filters',
  imports: [],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters implements OnInit {
  /****************************
   *****************************
   ***** დღეს აქ ვასრულებ მუშაობას პროექტზე... შემდეგ გავაგრძელებ <3
   ****************************
   ****************************/

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
