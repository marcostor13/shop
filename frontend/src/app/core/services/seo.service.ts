import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Product } from '../models/product.model';

const SITE_NAME = 'Aesthetica STEM';
const BASE_URL = 'https://shop.marcostorresalarcon.com';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  setPage(config: { title: string; description: string; canonical?: string; image?: string }): void {
    this.title.setTitle(`${config.title} | ${SITE_NAME}`);
    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    if (config.image) this.meta.updateTag({ property: 'og:image', content: config.image });
    if (config.canonical) this.setCanonical(config.canonical);
  }

  setProduct(product: Product): void {
    this.setPage({
      title: product.metaTitle ?? product.name,
      description: product.metaDescription ?? product.description,
      canonical: `${BASE_URL}/shop/${product.slug}`,
      image: product.images[0],
    });
    this.meta.updateTag({ property: 'og:type', content: 'product' });
    this.injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images,
      sku: product.sku,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'USD',
        availability: product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      },
    });
  }

  setBreadcrumb(items: { name: string; url: string }[]): void {
    this.injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: `${BASE_URL}${item.url}`,
      })),
    });
  }

  private setCanonical(url: string): void {
    let link: HTMLLinkElement = this.doc.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private injectJsonLd(data: object): void {
    const existing = this.doc.querySelector('script[type="application/ld+json"]');
    if (existing) existing.remove();
    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.doc.head.appendChild(script);
  }
}
