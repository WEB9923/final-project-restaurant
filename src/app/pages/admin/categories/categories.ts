import { Component, inject, signal } from '@angular/core';
import { Button } from '../../../components/ui/button/button';
import { Separator } from '../../../components/ui/separator/separator';
import { CategoriesService } from '../../../services/categories-service';
import { Loader } from '../../../components/ui/loader/loader';
import { LucidePencil, LucideTrash } from '@lucide/angular';
import { Sheet } from '../../../components/ui/sheet/sheet';
import { SheetService } from '../../../services/sheet-service';
import { CreateCategoryModel } from '../../../models/admin/create-category-model';
import { form, FormField, validateStandardSchema } from '@angular/forms/signals';
import { createCategorySchema } from '../../../schemas/admin/create-category-schema';
import { InvalidInput } from '../../../directives/invalid-input';
import { AdminCategoryService } from '../../../services/admin/admin-category-service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-categories',
  imports: [Button, Separator, Loader, Sheet, FormField, InvalidInput],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  categoriesService = inject(CategoriesService);
  sheetService = inject(SheetService);
  adminCategoryService = inject(AdminCategoryService);

  editMode = signal<boolean>(false);
  selectedCategoryId = signal<number | null>(null);
  deletingCategoryId = signal<number | null>(null);
  categoryModel = signal<CreateCategoryModel>({
    name: '',
  });

  createCategoryForm = form(this.categoryModel, (path): void =>
    validateStandardSchema(path, createCategorySchema),
  );

  openNewCategorySheet(): void {
    this.editMode.set(false);

    this.sheetService.open();
  }

  openEditCategorySheet(category: { id: number; name: string }): void {
    this.editMode.set(true);
    this.selectedCategoryId.set(category.id);

    this.categoryModel.set({
      name: category.name,
    });

    this.sheetService.open();
  }

  createCategory(evt: SubmitEvent): void {
    evt.preventDefault();

    const requests = this.editMode()
      ? this.adminCategoryService.updateCategory({
          name: this.categoryModel().name,
          id: this.selectedCategoryId()!,
        })
      : this.adminCategoryService.createCategory({ name: this.categoryModel().name });

    requests.pipe(switchMap(() => this.categoriesService.getCategories())).subscribe({
      next: () => {
        this.categoryModel.set({
          name: '',
        });

        this.sheetService.close();
      },
    });
  }

  deleteCategory(categoryId: number): void {
    this.deletingCategoryId.set(categoryId);

    this.adminCategoryService
      .deleteCategory({ categoryId })
      .pipe(switchMap(() => this.categoriesService.getCategories()))
      .subscribe({
        next: (): void => this.deletingCategoryId.set(null),
        error: (): void => this.deletingCategoryId.set(null),
      });
  }

  ngOnInit() {
    this.categoriesService.getCategories().subscribe();
  }

  protected readonly LucidePencil = LucidePencil;
  protected readonly LucideTrash = LucideTrash;
}
