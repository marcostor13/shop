import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3_600)
  @ApiOperation({ summary: 'Get all active products' })
  findAll(
    @Query('category') category?: string,
    @Query('tags') tags?: string,
  ) {
    const filter = {
      ...(category ? { category } : {}),
      ...(tags ? { tags: tags.split(',') } : {}),
    };
    return this.productsService.findAll(Object.keys(filter).length ? filter : undefined);
  }

  @Get('featured')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(1_800)
  @ApiOperation({ summary: 'Get featured products' })
  findFeatured() {
    return this.productsService.findFeatured();
  }

  @Get(':slug')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(7_200)
  @ApiOperation({ summary: 'Get product by slug' })
  findOne(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product (admin)' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product (admin)' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
