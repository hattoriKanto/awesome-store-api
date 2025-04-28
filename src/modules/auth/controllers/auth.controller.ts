import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { GetUser, Public } from 'src/decorators';
import { JwtAccessToken, JwtPayload, SuccessResponse } from 'src/types';
import { LoginUserDto, RegisterUserDto, VerifyUserDto } from '../dtos';
import { AtGuard } from '../guards/at.guard';
import { PassportLocalGuard } from '../guards/passport-local.guard';
import { AuthService } from '../services/auth.service';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@UseGuards(AtGuard)
@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() userData: RegisterUserDto): Promise<JwtAccessToken> {
    return this.authService.registerUser(userData);
  }

  @Public()
  @Post('login')
  @UseGuards(PassportLocalGuard)
  async login(@GetUser() user: LoginUserDto): Promise<JwtAccessToken> {
    return this.authService.loginUser(user);
  }

  @Post('verify')
  async verify(
    @GetUser() user: JwtPayload,
    @Body() verifyDto: VerifyUserDto,
  ): Promise<SuccessResponse> {
    return await this.authService.verifyEmail(user, verifyDto.verificationCode);
  }

  @Post('send-code')
  @UseGuards(AtGuard)
  async sendCode(@GetUser() user: JwtPayload): Promise<SuccessResponse> {
    return this.authService.sendVerificationCode(user);
  }
}
