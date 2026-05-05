import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <section class="py-6 min-h-[calc(100vh-70px)]">
      <div class="container-wrapper">
        <h1 class="title">Admin dashboard</h1>

        <div
          class="my-5 flex items-center w-full h-8.5 border-2 gap-0.5 p-0.5 rounded-radius overflow-hidden border-border"
        >
          <button
            routerLink="/admin/products"
            routerLinkActive="bg-accent text-primary"
            type="button"
            class="w-full flex items-center justify-center rounded-sm text-foreground font-medium cursor-pointer h-full"
          >
            Products
          </button>
          <button
            routerLink="/admin/categories"
            routerLinkActive="bg-accent text-primary"
            type="button"
            class="w-full flex items-center justify-center rounded-sm text-foreground font-medium cursor-pointer h-full"
          >
            Categories
          </button>
        </div>

        <router-outlet />
      </div>
    </section>
  `,
})
export class AdminLayout {}
