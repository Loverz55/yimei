import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from './prisma.client';
import { Prisma } from '../../generated/prisma/client';

export type PrismaTx = Prisma.TransactionClient;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  client = prisma;

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }

  async tx<T>(
    fn: (tx: PrismaTx) => Promise<T>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    },
  ) {
    return this.client.$transaction((tx) => fn(tx), options);
  }
}
