import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsNotIn } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsNotEmpty()
  @IsNotIn([0])
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  price: number;
}
