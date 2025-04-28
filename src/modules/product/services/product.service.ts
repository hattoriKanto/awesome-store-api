import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { ProductsResponse, SortOrderQuery } from 'src/types';
import { CreateProductDto, QueryProductDto, UpdateProductDto } from '../dtos';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  getTotalProductsAmount(name: string): Promise<number> {
    return this.prisma.product.count({
      where: { name: { contains: name, mode: 'insensitive' } },
    });
  }

  findProductById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async findAllProducts({
    name,
    orderBy = 'createdAt',
    sortOrder = SortOrderQuery.asc,
    page = 1,
    limit = 10,
  }: QueryProductDto): Promise<ProductsResponse> {
    const products = await this.prisma.product.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
      orderBy: { [orderBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalProducts = await this.getTotalProductsAmount(name);
    const totalPages = Math.ceil(totalProducts / limit);
    const nextPage = page < totalPages ? page + 1 : null;

    return {
      products,
      totalProducts,
      totalPages,
      nextPage,
    };
  }

  createProduct(data: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    return this.prisma.product.update({ where: { id }, data });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }
}
