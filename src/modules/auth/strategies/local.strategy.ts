import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { MESSAGES } from 'src/constants';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../dtos';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<LoginUserDto> {
    try {
      await this.authService.validateUser({
        email,
        password,
      });
      return { email, password };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnauthorizedException(MESSAGES.user.accessDenied);
    }
  }
}
