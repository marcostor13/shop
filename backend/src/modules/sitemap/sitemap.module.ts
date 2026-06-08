import { Module } from '@nestjs/common';
import { SitemapController } from './sitemap.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [SitemapController],
})
export class SitemapModule {}
