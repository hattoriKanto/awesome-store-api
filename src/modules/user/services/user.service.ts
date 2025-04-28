import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { MESSAGES } from 'src/constants';
import { UserCodeUpdate, UserStatusUpdate } from 'src/types';
import { AddressService } from 'src/modules/address/services/address.service';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { RegisterUserDto } from 'src/modules/auth/dtos';
import { RegisterAddressDto } from 'src/modules/address/dtos';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private addressService: AddressService,
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

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
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
    const user = await this.findUserByEmail(email);
    if (user) {
      throw new ConflictException(MESSAGES.user.exist);
    }

    const newUser = await this.prisma.$transaction(async (tx) => {
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
      const address = await this.addressService.createAddress(
        createdUser.id,
        addressData,
        tx,
      );

      const newUser = await this.findUserById(address.userId, tx);
      return newUser;
    });

    return newUser;
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
}
