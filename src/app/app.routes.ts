import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';
import { AdminLayout } from './layouts/admin-layout/admin-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
        title: 'Foodie',
      },
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

      // ADMIN
      {
        path: 'admin',
        canActivate: [authGuard],
        component: AdminLayout,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'products' },
          {
            path: 'products',
            loadComponent: () => import('./pages/admin/products/products').then((m) => m.Products),
            title: 'Admin - Products',
          },
          {
            path: 'categories',
            loadComponent: () =>
              import('./pages/admin/categories/categories').then((m) => m.Categories),
            title: 'Admin - Categories',
          },
        ],
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
        path: 'forgot-password',
        loadComponent: () =>
          import('./pages/forgot-password/forgot-password').then((m) => m.ForgotPassword),
        title: 'Reset password',
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./pages/reset-password/reset-password').then((m) => m.ResetPassword),
        title: 'Forgot password',
      },
      {
        path: 'verify',
        loadComponent: () => import('./pages/verify/verify').then((m) => m.Verify),
        title: 'Verify Email',
      },
    ],
  },

  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
