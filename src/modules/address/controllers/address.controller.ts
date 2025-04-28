import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Address } from '@prisma/client';
import { GetResource, GetUser } from 'src/decorators';
import { JwtPayload, SuccessResponse } from 'src/types';
import { AtGuard } from 'src/modules/auth/guards/at.guard';
import { OwnerGuard } from 'src/modules/auth/guards/owner.guard';
import { AddressService } from '../services/address.service';
import { AddressLoadGuard } from '../guards/address-load.guard';
import { RegisterAddressDto, UpdateAddressDto } from '../dtos';

@UseGuards(AtGuard)
@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Get()
  async getAllAddressesByUser(@GetUser() user: JwtPayload): Promise<Address[]> {
    return this.addressService.findAllAddressesByUserId(user.sub);
  }

  @UseGuards(AddressLoadGuard, OwnerGuard)
  @Get(':id')
  async getAddressById(@GetResource() resource: Address): Promise<Address> {
    return resource;
  }

  @Post()
  async createAddress(
    @GetUser() user: JwtPayload,
    @Body() data: RegisterAddressDto,
  ): Promise<Address> {
    return this.addressService.createAddress(user.sub, data);
  }

  @UseGuards(AddressLoadGuard, OwnerGuard)
  @Patch(':id')
  async updateAddress(
    @GetResource() resource: Address,
    @Body() data: UpdateAddressDto,
  ): Promise<Address> {
    return this.addressService.updateAddress(resource.id, data);
  }

  @UseGuards(AddressLoadGuard, OwnerGuard)
  @Delete(':id')
  async deleteAddressById(
    @GetResource() resource: Address,
  ): Promise<SuccessResponse> {
    return this.addressService.deleteAddressById(resource.id);
  }
}
