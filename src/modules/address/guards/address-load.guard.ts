import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtPayload } from 'src/types';
import { MESSAGES } from 'src/constants';
import { AddressService } from '../services/address.service';

@Injectable()
export class AddressLoadGuard implements CanActivate {
  constructor(private addressService: AddressService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    const addressId = request.params.id as string;

    if (!user) {
      throw new BadRequestException(MESSAGES.user.accessDenied);
    }

    if (!addressId) {
      throw new BadRequestException(MESSAGES.address.idRequired);
    }

    const address = await this.addressService.findAddressById(addressId);
    if (!address) {
      throw new NotFoundException(MESSAGES.address.notFound);
    }

    request.resource = address;

    return true;
  }
}
