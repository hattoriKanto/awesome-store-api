import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { JwtAccessToken, JwtPayload, SuccessResponse } from 'src/types';
import { MESSAGES } from 'src/constants';
import { UserService } from 'src/modules/user/services/user.service';
import { EmailService } from 'src/modules/email/services/email.service';
import {
  generateVerificationCode,
  getPasswordHash,
  getPasswordSalt,
} from '../utils';
import { LoginUserDto, RegisterUserDto } from '../dtos';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser({ email, password }: LoginUserDto): Promise<void> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException(MESSAGES.user.invalidCredentials);
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = await getPasswordHash(password, salt);
    if (hash !== storedHash) {
      throw new UnauthorizedException(MESSAGES.user.invalidCredentials);
    }

    if (!user.isVerified) {
      throw new ForbiddenException(MESSAGES.user.unverifiedEmail);
    }
  }

  async validateUserById(id: string): Promise<void> {
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new UnauthorizedException(MESSAGES.user.invalidCredentials);
    }
  }

  async registerUser(userData: RegisterUserDto): Promise<JwtAccessToken> {
    const { password, email } = userData;

    const salt = getPasswordSalt();
    const hash = await getPasswordHash(password, salt);
    const hashedPassword = `${salt}.${hash}`;
    const verificationCode = generateVerificationCode();

    const user = await this.userService.createUser({
      ...userData,
      password: hashedPassword,
      verificationCode,
    });
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    await this.emailService.sendVerificationEmail(email, verificationCode);

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async loginUser({ email }: LoginUserDto): Promise<JwtAccessToken> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException(MESSAGES.user.notFound);
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async verifyEmail(
    { sub }: JwtPayload,
    verificationCode: string,
  ): Promise<SuccessResponse> {
    const user = await this.userService.findUserById(sub);
    if (!user) {
      throw new UnauthorizedException(MESSAGES.user.notFound);
    }

    if (user.verificationCode !== verificationCode) {
      throw new BadRequestException(MESSAGES.user.invalidVerificationCode);
    }

    await this.userService.updateUserStatus({ id: sub, isVerified: true });

    return {
      success: true,
      messages: MESSAGES.user.sucessVerification!,
      timestamp: new Date().toISOString(),
    };
  }

  async sendVerificationCode({
    email,
    sub,
  }: JwtPayload): Promise<SuccessResponse> {
    const user = await this.userService.findUserById(sub);
    if (user && user.isVerified) {
      throw new BadRequestException(MESSAGES.user.alreadyVerified);
    }

    const verificationCode = generateVerificationCode();
    await this.userService.updateUserCode({ id: sub, verificationCode });

    await this.emailService.sendVerificationEmail(email, verificationCode);

    return {
      success: true,
      messages: MESSAGES.user.successCodeSend!,
      timestamp: new Date().toISOString(),
    };
  }

  async isAdmin(id: string): Promise<boolean> {
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new UnauthorizedException(MESSAGES.user.notFound);
    }

    return user.role === $Enums.Role.ADMIN;
  }
}
