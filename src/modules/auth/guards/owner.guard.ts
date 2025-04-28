import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Address } from '@prisma/client';
import { MESSAGES } from 'src/constants';
import { JwtPayload } from 'src/types';

@Injectable()
export class OwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    const resource = request.resource as Address;

    if (!user) {
      throw new BadRequestException(MESSAGES.user.accessDenied);
    }

    if (resource.userId !== user.sub) {
      throw new BadRequestException(MESSAGES.user.accessDenied);
    }

    return true;
  }
}
