import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';

@Global()
@Module({
  exports: [PrismaService],
  providers: [PrismaService],
})
export class PrismaModule {}
