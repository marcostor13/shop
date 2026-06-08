import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'ethos', renderMode: RenderMode.Prerender },
  { path: 'shop', renderMode: RenderMode.Server },
  { path: 'shop/:slug', renderMode: RenderMode.Server },
  { path: 'cart', renderMode: RenderMode.Client },
  { path: 'checkout', renderMode: RenderMode.Client },
  { path: 'order-confirmed', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Server },
];
