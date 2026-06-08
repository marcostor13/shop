import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { SitemapModule } from './modules/sitemap/sitemap.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI', 'mongodb://localhost:27017/aesthetica'),
      }),
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: 3600,
        max: 500,
        // Redis config (optional — falls back to in-memory)
        ...(config.get('REDIS_HOST')
          ? {
              store: 'redis',
              host: config.get<string>('REDIS_HOST'),
              port: config.get<number>('REDIS_PORT', 6379),
            }
          : {}),
      }),
    }),

    ProductsModule,
    OrdersModule,
    UsersModule,
    AuthModule,
    CartModule,
    SitemapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
