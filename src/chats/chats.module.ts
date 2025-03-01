import { Module, ValidationPipe } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { APP_PIPE } from '@nestjs/core';
import { CacheModule } from 'src/cache/cache.module';
import { MessagesGateway } from './chats.gateway';

@Module({
  imports: [DatabaseModule, CacheModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    ChatsService,
    MessagesGateway,
  ],
  controllers: [ChatsController],
})
export class ChatsModule {}
