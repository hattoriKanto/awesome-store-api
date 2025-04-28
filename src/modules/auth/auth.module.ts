import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { EmailModule } from '../email/email.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AtStrategy } from './strategies/at.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRE'),
        },
      }),
    }),
    UserModule,
    EmailModule,
    PassportModule,
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, AtStrategy],
})
export class AuthModule {}
