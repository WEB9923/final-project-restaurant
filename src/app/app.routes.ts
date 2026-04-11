import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
      {
        path: 'menu',
        loadComponent: () => import('./pages/menu/menu').then((m) => m.Menu),
        title: 'Menu',
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./pages/product/product').then((m) => m.Product),
      },

      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
        title: 'Profile',
      },
      {
        path: 'cart',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/cart/cart').then((m) => m.Cart),
        title: 'Cart',
      },
      {
        path: 'settings',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings),
        title: 'Settings',
      },
    ],
  },

  {
    path: 'auth',
    component: AuthLayout,
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then((m) => m.Login),
        title: 'Login',
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register/register').then((m) => m.Register),
        title: 'Register',
      },
      {
        path: 'verify',
        loadComponent: () => import('./pages/verify/verify').then((m) => m.Verify),
        title: 'Verify Email',
      },
    ],
  },
];
