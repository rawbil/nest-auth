import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //makes the prisma module available globally 
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
