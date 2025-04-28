import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ModelMessages } from 'src/types';
import { isExistMiddleware } from 'src/middleware';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule implements NestModule {
  constructor(private productService: ProductService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        isExistMiddleware(
          this.productService.findProductById.bind(this.productService),
          ModelMessages.product,
        ),
      )
      .forRoutes({ path: '/proudct/:id', method: RequestMethod.ALL });
  }
}
