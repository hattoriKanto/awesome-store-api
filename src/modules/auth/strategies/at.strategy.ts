import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MESSAGES } from 'src/constants';
import { JwtPayload } from 'src/types';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    try {
      await this.authService.validateUserById(payload.sub);
      return payload;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnauthorizedException(MESSAGES.user.invalidCredentials);
    }
  }
}
