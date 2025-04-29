import { Transform } from 'class-transformer';
import { IsNotIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  amount: number;

  @IsString()
  @IsOptional()
  category: string;

  @IsNumber()
  @IsOptional()
  @IsNotIn([0])
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  price: number;
}
