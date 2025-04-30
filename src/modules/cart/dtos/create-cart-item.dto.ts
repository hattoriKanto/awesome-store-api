import { CartItem } from '@prisma/client';
import {
  IsInt,
  IsNotEmpty,
  IsNotIn,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateCartItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @IsNotEmpty()
  @IsNotIn([0])
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  @IsNotIn([0])
  price: number;
}
