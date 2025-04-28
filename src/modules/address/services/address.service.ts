import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Address, Prisma } from '@prisma/client';
import { MESSAGES } from 'src/constants';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { SuccessResponse } from 'src/types';
import { RegisterAddressDto, UpdateAddressDto } from '../dtos';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async findAddressById(id: string): Promise<Address | null> {
    return this.prisma.address.findUnique({ where: { id } });
  }

  async findAllAddressesByUserId(userId: string): Promise<Address[]> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(MESSAGES.user.notFound);
    }

    const addresses = await this.prisma.address.findMany({ where: { userId } });

    return addresses;
  }

  async createAddress(
    userId: string,
    data: RegisterAddressDto,
    tx?: Prisma.TransactionClient,
  ): Promise<Address> {
    const client = tx ?? this.prisma;
    const user = await client.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(MESSAGES.user.notFound);
    }

    return client.address.create({
      data: {
        ...data,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async updateAddress(id: string, data: UpdateAddressDto): Promise<Address> {
    const address = await this.findAddressById(id);
    if (!address) {
      throw new NotFoundException(MESSAGES.address.notFound);
    }

    return this.prisma.address.update({ where: { id }, data });
  }

  async deleteAddressById(id: string): Promise<SuccessResponse> {
    const address = await this.findAddressById(id);
    if (!address) {
      throw new NotFoundException(MESSAGES.address.notFound);
    }

    const addresses = await this.findAllAddressesByUserId(address.userId);
    if (addresses.length === 1) {
      throw new BadRequestException(MESSAGES.address.atleastOne);
    }

    await this.prisma.address.delete({ where: { id } });

    return {
      success: true,
      messages: MESSAGES.address.successDeletion,
      timestamp: new Date().toISOString(),
    };
  }

  async deleteAllAddressesByUserId(userId: string): Promise<SuccessResponse> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(MESSAGES.user.notFound);
    }

    await this.prisma.address.deleteMany({ where: { userId } });

    return {
      success: true,
      messages: MESSAGES.address.successDeletion,
      timestamp: new Date().toISOString(),
    };
  }
}
