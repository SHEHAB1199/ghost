import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { UserDecorator } from 'decorators/user.decorator';
import { CacheService } from 'src/cache/cache.service';

@Controller('chats')
export class ChatsController {
  constructor(
    private chatsService: ChatsService,
    private cacheService: CacheService,
  ) {}

  @Get()
  async getChats(
    @UserDecorator({ idOnly: true }) userId: string,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('skip', ParseIntPipe) skip: number,
  ) {
    return this.chatsService.getChats({ limit, skip, userId });
  }

  @Get('/:chatId')
  async getMessages(
    @UserDecorator({ idOnly: true }) userId: string,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('skip', ParseIntPipe) skip: number,
    @Param('chatId') chatId: string,
  ) {
    return this.chatsService.getMessages({ limit, skip, userId, chatId });
  }

  @Get('/connected-users')
  async getConnectedUsers(@UserDecorator({ idOnly: true }) userId: string) {
    const connected = await this.cacheService.getSet('users:connected');
    return this.chatsService.connectedUsers({ userId, connected });
  }

  @Post('/:receiverId')
  async createChat(
    @UserDecorator({ idOnly: true }) senderId: string,
    @Param('receiverId') receiverId: string,
  ) {
    return this.chatsService.createChat({ senderId, receiverId });
  }
}
