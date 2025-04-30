import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtPayload } from 'src/types';
import { MESSAGES } from 'src/constants';
import { CartService } from '../services/cart.service';

@Injectable()
export class CartOwnerGuard implements CanActivate {
  constructor(private cartService: CartService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    if (!user) {
      throw new BadRequestException(MESSAGES.user.accessDenied);
    }

    const cart = await this.cartService.findCartByUserId(user.sub);

    if (cart.userId !== user.sub) {
      throw new BadRequestException(MESSAGES.user.accessDenied);
    }

    request.resource = cart;
    return true;
  }
}
