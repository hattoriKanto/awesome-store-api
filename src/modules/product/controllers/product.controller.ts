import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { $Enums, Product } from '@prisma/client';
import { GetResource, Roles } from 'src/decorators';
import { ProductsResponse, SuccessResponse } from 'src/types';
import { MESSAGES } from 'src/constants';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { AtGuard } from 'src/modules/auth/guards/at.guard';
import { ProductService } from '../services/product.service';
import { CreateProductDto, QueryProductDto, UpdateProductDto } from '../dtos';

@UseGuards(AtGuard, RolesGuard)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getProducts(
    @Query() queryParams: QueryProductDto,
  ): Promise<ProductsResponse> {
    return this.productService.findAllProducts(queryParams);
  }

  @Get(':id')
  async getProduct(@GetResource() resource: Product): Promise<Product> {
    return resource;
  }

  // @Roles($Enums.Role.ADMIN)
  @Post()
  createProduct(@Body() createProduct: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(createProduct);
  }

  @Roles($Enums.Role.ADMIN)
  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() data: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(id, data);
  }

  @Roles($Enums.Role.ADMIN)
  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<SuccessResponse> {
    await this.productService.deleteProduct(id);
    return {
      success: true,
      messages: MESSAGES.product.successDeletion,
      timestamp: new Date().toISOString(),
    };
  }
}
