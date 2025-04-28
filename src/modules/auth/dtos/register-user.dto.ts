import { Transform } from 'class-transformer';
import {
  IsDecimal,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { MESSAGES } from 'src/constants';
import { CreateUserDto } from 'src/types';

export class RegisterUserDto implements CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/, {
    message: MESSAGES.registerUser.passwordPattern,
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsNotEmpty()
  locality: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(-180)
  @Max(180)
  longitude: number;
}
