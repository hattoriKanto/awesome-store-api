import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AddressModule } from '../address/address.module';
import { UserService } from './services/user.service';

@Module({
  imports: [PrismaModule, AddressModule],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
