import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cart, CartItem, Prisma } from '@prisma/client';
import { CartItemService } from './cart-item.service';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { MESSAGES } from 'src/constants';
import { SuccessResponse } from 'src/types';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private cartItemService: CartItemService,
  ) {}

  async findCartByUserId(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Cart> {
    const client = tx ?? this.prisma;
    const cart = await client.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cart) {
      return this.createCart(userId, tx);
    }

    return cart;
  }

  async findCartById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Cart & { cartItems: CartItem[] }> {
    const client = tx ?? this.prisma;

    const cart = await client.cart.findUnique({
      where: { id },
      include: { cartItems: true },
    });

    if (!cart) {
      throw new NotFoundException(MESSAGES.cart.notFound);
    }

    return cart;
  }

  createCart(userId: string, tx?: Prisma.TransactionClient): Promise<Cart> {
    const client = tx ?? this.prisma;
    return client.cart.create({ data: { userId } });
  }

  async updateCartTotal(
    cartId: string,
    amount: Prisma.Decimal,
    operation: 'increment' | 'decrement' = 'increment',
    tx?: Prisma.TransactionClient,
  ): Promise<Cart> {
    if (!Number.isFinite(Number(amount))) {
      throw new BadRequestException(MESSAGES.cart.infiniteNumber);
    }

    const client = tx ?? this.prisma;
    return client.cart.update({
      where: { id: cartId },
      data: {
        totalPrice: {
          [operation]: amount,
        },
      },
    });
  }

  async cartCleanup(cartId: string): Promise<SuccessResponse> {
    return this.prisma.$transaction(async (tx) => {
      const cart = await this.findCartById(cartId, tx);
      if (!cart) {
        throw new NotFoundException(MESSAGES.cart.notFound);
      }

      await this.cartItemService.deleteAllCartItemsByCartId(cart.id, tx);
      await this.updateCartTotal(cart.id, cart.totalPrice, 'decrement', tx);

      return {
        success: true,
        messages: MESSAGES.cart.cleaned,
        timestamp: new Date().toISOString(),
      };
    });
  }
}
