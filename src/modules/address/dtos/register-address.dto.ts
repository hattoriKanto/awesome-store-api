import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { MESSAGES } from 'src/constants';
import { CreateAddressDto } from 'src/types';

export class RegisterAddressDto implements CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  country: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  region: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  locality: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  street: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  postalCode: string;

  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsBoolean()
  @IsOptional()
  isDefault: boolean;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[\w\s-]+$/, { message: MESSAGES.address.labelPattern })
  @Transform(({ value }) => value.trim())
  label: string;
}
