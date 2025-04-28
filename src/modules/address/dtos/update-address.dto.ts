import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { MESSAGES } from 'src/constants';
import { UpdateAddress } from 'src/types';

export class UpdateAddressDto implements UpdateAddress {
  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  region: string;

  @IsString()
  @IsOptional()
  locality: string;

  @IsString()
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
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
  @IsOptional()
  @MaxLength(50)
  @Matches(/^[\w\s-]+$/, { message: MESSAGES.address.labelPattern })
  @Transform(({ value }) => value.trim())
  label: string;
}
