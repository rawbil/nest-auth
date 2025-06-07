import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect()
      .then(() => console.log('DB Connected'))
      .catch((err) => console.log(err));
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
