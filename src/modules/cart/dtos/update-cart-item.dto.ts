import { Decimal } from '@prisma/client/runtime/library';
import { IsDecimal, IsNotIn, IsNumber, IsOptional } from 'class-validator';

export class UpdateCartItemDto {
  @IsNumber()
  @IsOptional()
  @IsNotIn([0])
  amount?: number;

  @IsDecimal()
  @IsOptional()
  @IsNotIn([0])
  totalPrice?: Decimal;
}
