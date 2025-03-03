import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaClient, Prisma } from '@prisma/client'; // Import Prisma types

type OnResult = (result: any) => Promise<any> | any;

@Injectable()
export class DataBaseService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error'> // Add Prisma types
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private eventEmitter: EventEmitter2) {
    super();
  }

  private handleCreateNotification(args: any) {
    return async (notification: any) => {
      await this.eventEmitter.emitAsync('notification.create', notification);
    };
  }

  async onModuleInit() {
    this.$use(async (params, next) => {
      let onResult: OnResult = (result) => result;

      switch (`${params.model}.${params.action}`) {
        case 'Notification.create':
          onResult = this.handleCreateNotification(params.args);
          break;
      }

      const before = Date.now();
      const result = await next(params);
      console.info(
        `Query: ${params.model}.${params.action} => ${Date.now() - before}ms`,
      );

      await onResult(result);
      return result;
    });

    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private handleUserCreate(args: any) {
    return async (user: any) => {
      if (user.otp) {
        await this.eventEmitter.emitAsync('user.createWithOTP', user);
      }
    };
  }
}