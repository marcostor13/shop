import { Controller, Get, Header } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'https://aesthetica.com';

@Controller()
export class SitemapController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml')
  @Header('Cache-Control', 'public, max-age=86400')
  async sitemap(): Promise<string> {
    const slugs = await this.productsService.findAllSlugs();

    const staticUrls = [
      { loc: FRONTEND_URL, priority: '1.0', changefreq: 'daily' },
      { loc: `${FRONTEND_URL}/shop`, priority: '0.9', changefreq: 'daily' },
      { loc: `${FRONTEND_URL}/ethos`, priority: '0.5', changefreq: 'monthly' },
    ];

    const productUrls = slugs.map(p => ({
      loc: `${FRONTEND_URL}/shop/${p.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
    }));

    return this.buildXml([...staticUrls, ...productUrls]);
  }

  @Get('robots.txt')
  @Header('Content-Type', 'text/plain')
  @Header('Cache-Control', 'public, max-age=86400')
  robots(): string {
    return [
      'User-agent: *',
      'Allow: /',
      'Disallow: /checkout',
      'Disallow: /cart',
      'Disallow: /account',
      'Disallow: /api/',
      '',
      `Sitemap: ${FRONTEND_URL}/sitemap.xml`,
    ].join('\n');
  }

  private buildXml(urls: { loc: string; priority: string; changefreq: string; lastmod?: string }[]): string {
    const entries = urls
      .map(u => [
        '  <url>',
        `    <loc>${u.loc}</loc>`,
        `    <changefreq>${u.changefreq}</changefreq>`,
        `    <priority>${u.priority}</priority>`,
        u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : '',
        '  </url>',
      ].filter(Boolean).join('\n'))
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
  }
}
