import { Module } from '@nestjs/common';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';
import { CartItemService } from './services/cart-item.service';

@Module({
  exports: [CartService, CartItemService],
  controllers: [CartController],
  providers: [CartService, CartItemService],
})
export class CartModule {}
