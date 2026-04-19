import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../components/shared/navbar/navbar';
import { Footer } from '../../components/shared/footer/footer';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Navbar, Footer],
  template: `
    <app-navbar></app-navbar>
    <main class="min-h-[calc(100vh-70px)] mb-8">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
})
export class MainLayout {}
