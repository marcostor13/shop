import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductListItem } from '../models/product.model';
import { environment } from '../../../environments/environment';

export interface ProductsFilter {
  category?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/products`;

  getAll(filter?: ProductsFilter): Observable<ProductListItem[]> {
    const params = this.buildParams(filter);
    return this.http.get<ProductListItem[]>(this.baseUrl, { params });
  }

  getFeatured(): Observable<ProductListItem[]> {
    return this.http.get<ProductListItem[]>(`${this.baseUrl}/featured`);
  }

  getBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${slug}`);
  }

  private buildParams(filter?: ProductsFilter): HttpParams {
    let params = new HttpParams();
    if (!filter) return params;
    if (filter.category) params = params.set('category', filter.category);
    if (filter.tags?.length) params = params.set('tags', filter.tags.join(','));
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.limit) params = params.set('limit', filter.limit.toString());
    return params;
  }
}
