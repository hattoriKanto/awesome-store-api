import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartItem, Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { CartService } from './cart.service';
import { CreateCartItemDto, UpdateCartItemDto } from '../dtos';
import { MESSAGES } from 'src/constants';
import { SuccessResponse } from 'src/types';

@Injectable()
export class CartItemService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => CartService))
    private cartService: CartService,
  ) {}

  findAllCartItemsByCartId(cartId: string): Promise<CartItem[]> {
    return this.prisma.cartItem.findMany({ where: { cartId } });
  }

  findCartItemById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<CartItem | null> {
    const client = tx ?? this.prisma;
    return client.cartItem.findUnique({ where: { id } });
  }

  async findCartItemByProductId(
    productId: string,
    cartId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<CartItem | null> {
    const client = tx ?? this.prisma;

    const cart = client.cart.findUnique({ where: { id: cartId } });
    if (!cart) {
      throw new NotFoundException(MESSAGES.cart.notFound);
    }

    return client.cartItem.findFirst({ where: { cartId, productId } });
  }

  async createCartItem(
    userId: string,
    { amount, price, productId }: CreateCartItemDto,
  ): Promise<CartItem> {
    const totalPrice = new Prisma.Decimal(amount).mul(price);

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) {
        throw new NotFoundException(MESSAGES.product.notFound);
      }

      if (product.amount < amount) {
        throw new BadRequestException(MESSAGES.product.amountError);
      }

      const cart = await this.cartService.findCartByUserId(userId, tx);

      const cartItem = await this.findCartItemByProductId(productId, cart.id);
      if (cartItem) {
        const totalAmount = amount + cartItem.amount;
        if (product.amount < totalAmount) {
          throw new BadRequestException(MESSAGES.product.amountError);
        }

        const updatedCartItem = await this.updateCartItem(
          cartItem.id,
          {
            amount,
            totalPrice,
          },
          'increment',
          tx,
        );

        await this.cartService.updateCartTotal(
          cart.id,
          totalPrice,
          'increment',
          tx,
        );

        return updatedCartItem;
      }

      const newCartItem = await tx.cartItem.create({
        data: {
          amount,
          price,
          productId,
          cartId: cart.id,
          totalPrice,
        },
      });

      await this.cartService.updateCartTotal(
        cart.id,
        totalPrice,
        'increment',
        tx,
      );

      return newCartItem;
    });
  }

  async updateCartItem(
    cartItemId: string,
    data: UpdateCartItemDto,
    operation: 'increment' | 'decrement' = 'increment',
    tx?: Prisma.TransactionClient,
  ): Promise<CartItem> {
    const client = tx ?? this.prisma;

    const cartItem = await this.findCartItemById(cartItemId, tx);
    if (!cartItem) {
      throw new NotFoundException(MESSAGES.item.notFound);
    }

    return client.cartItem.update({
      where: { id: cartItemId },
      data: {
        amount: {
          [operation]: data.amount,
        },
        totalPrice: {
          [operation]: data.totalPrice,
        },
      },
    });
  }

  async deleteAllCartItemsByCartId(
    cartId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<SuccessResponse> {
    const client = tx ?? this.prisma;
    await client.cartItem.deleteMany({ where: { cartId } });
    return {
      success: true,
      messages: MESSAGES.item.successDeletion,
      timestamp: new Date().toISOString(),
    };
  }

  async deleteCartItem(id: string): Promise<SuccessResponse> {
    return this.prisma.$transaction(async () => {
      const cartItem = await this.findCartItemById(id);
      if (!cartItem) {
        throw new NotFoundException(MESSAGES.item.notFound);
      }

      await this.prisma.cartItem.delete({ where: { id } });

      await this.cartService.updateCartTotal(
        cartItem.cartId,
        cartItem.totalPrice,
        'decrement',
      );

      return {
        success: true,
        messages: MESSAGES.item.successDeletion,
        timestamp: new Date().toISOString(),
      };
    });
  }
}
