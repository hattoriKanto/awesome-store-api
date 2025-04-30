import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AddressModule } from '../address/address.module';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [PrismaModule, AddressModule, CartModule],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
