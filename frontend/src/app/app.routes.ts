import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'shop',
    loadComponent: () => import('./pages/shop/shop.component').then(m => m.ShopComponent),
  },
  {
    path: 'shop/:slug',
    loadComponent: () => import('./pages/product/product.component').then(m => m.ProductComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
  },
  {
    path: 'order-confirmed',
    loadComponent: () => import('./pages/order-confirmed/order-confirmed.component').then(m => m.OrderConfirmedComponent),
  },
  {
    path: 'ethos',
    loadComponent: () => import('./pages/ethos/ethos.component').then(m => m.EthosComponent),
  },
  { path: '**', redirectTo: '' },
];
