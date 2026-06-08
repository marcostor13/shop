import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(200) name: string;
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(100) slug: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsNumber() @Min(0) price: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) comparePrice?: number;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) images?: string[];
  @ApiProperty() @IsString() @IsNotEmpty() category: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() sku?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) stock?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(60) metaTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(160) metaDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}
