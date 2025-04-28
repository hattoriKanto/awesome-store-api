import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/decorators';
import { JwtPayload } from 'src/types';
import { AuthService } from '../services/auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get(Roles, context.getHandler());
    if (!role) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { sub: id } = request.user as JwtPayload;

    const isAdmin = await this.authService.isAdmin(id);
    return isAdmin;
  }
}
