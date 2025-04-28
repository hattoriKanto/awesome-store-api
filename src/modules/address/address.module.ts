import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AddressService } from './services/address.service';
import { AddressController } from './controllers/address.controller';

@Module({
  imports: [PrismaModule],
  exports: [AddressService],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
