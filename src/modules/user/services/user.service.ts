import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { MESSAGES } from 'src/constants';
import { SuccessResponse, UserCodeUpdate, UserStatusUpdate } from 'src/types';
import { AddressService } from 'src/modules/address/services/address.service';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { CartService } from 'src/modules/cart/services/cart.service';
import { RegisterUserDto } from 'src/modules/auth/dtos';
import { RegisterAddressDto } from 'src/modules/address/dtos';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private addressService: AddressService,
    private cartService: CartService,
  ) {}

  async findUserById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<User | null> {
    const client = tx ?? this.prisma;
    return client.user.findUnique({
      where: { id },
      include: { addresses: true },
    });
  }

  async findUserByEmail(
    email: string,
    tx?: Prisma.TransactionClient,
  ): Promise<User | null> {
    const client = tx ?? this.prisma;
    return client.user.findUnique({ where: { email } });
  }

  async findAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async createUser({
    country,
    region,
    locality,
    postalCode,
    street,
    latitude,
    longitude,
    email,
    fullName,
    password,
    phone,
    verificationCode,
  }: RegisterUserDto & { verificationCode: string }): Promise<User> {
    return this.prisma.$transaction(async (tx) => {
      const user = await this.findUserByEmail(email, tx);
      if (user) {
        throw new ConflictException(MESSAGES.user.exist);
      }

      const createdUser = await tx.user.create({
        data: {
          email,
          fullName,
          password,
          phone,
          verificationCode,
        },
      });

      const addressData: RegisterAddressDto = {
        country,
        region,
        locality,
        postalCode,
        street,
        latitude,
        longitude,
        isDefault: false,
        label: null,
      };
      await this.addressService.createAddress(createdUser.id, addressData, tx);

      await this.cartService.createCart(createdUser.id, tx);

      return this.findUserById(createdUser.id, tx);
    });
  }

  async updateUserStatus({ id, isVerified }: UserStatusUpdate): Promise<void> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException(MESSAGES.user.notFound);
    }

    await this.prisma.user.update({
      where: { id },
      data: { isVerified, verificationCode: null },
    });
  }

  async updateUserCode({
    id,
    verificationCode,
  }: UserCodeUpdate): Promise<void> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException(MESSAGES.user.notFound);
    }

    await this.prisma.user.update({
      where: { id },
      data: { verificationCode },
    });
  }

  async deleteUserById(id: string): Promise<SuccessResponse> {
    return this.prisma.$transaction(async (tx) => {
      const user = await this.findUserById(id, tx);
      if (!user) {
        throw new NotFoundException(MESSAGES.user.notFound);
      }

      await tx.user.delete({ where: { id } });

      return {
        success: true,
        messages: MESSAGES.user.successDeletion,
        timestamp: new Date().toISOString(),
      };
    });
  }
}
