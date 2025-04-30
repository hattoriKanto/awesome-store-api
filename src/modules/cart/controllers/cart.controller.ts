import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Cart } from '@prisma/client';
import { AtGuard } from 'src/modules/auth/guards/at.guard';
import { GetResource, GetUser } from 'src/decorators';
import { JwtPayload, SuccessResponse } from 'src/types';
import { CreateCartItemDto } from '../dtos';
import { CartOwnerGuard } from '../guards/cart-owner.guard';
import { CartService } from '../services/cart.service';
import { CartItemService } from '../services/cart-item.service';

@UseGuards(AtGuard, CartOwnerGuard)
@Controller('cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private cartItemService: CartItemService,
  ) {}

  @Get()
  async getCart(@GetResource() resource: Cart): Promise<Cart> {
    return resource;
  }

  @Post()
  async createCartItem(
    @GetUser() user: JwtPayload,
    @Body() cartItem: CreateCartItemDto,
  ): Promise<Cart> {
    const createdCartItem = await this.cartItemService.createCartItem(
      user.sub,
      cartItem,
    );
    return this.cartService.findCartById(createdCartItem.cartId);
  }

  @Delete(':id')
  async deleteCartItem(
    @Param('id') cartItemId: string,
  ): Promise<SuccessResponse> {
    return this.cartItemService.deleteCartItem(cartItemId);
  }
}
