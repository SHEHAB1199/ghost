import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MessageDTO } from './chats.dto';
import { CacheService } from 'src/cache/cache.service';
import { Client, getClientId } from 'decorators/Client.decorator';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  pingTimeout: 10000,
  pingInterval: 20000,
  transports: ['websocket'],
  path: '/messages',
  maxHttpBufferSize: 20000,
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(MessagesGateway.name);

  constructor(
    private chatsService: ChatsService,
    private cacheService: CacheService,
  ) {}

  private async handleError({ socket, error }) {
    socket.emit('error', {
      messages: error.messages ?? [
        { en: error?.message ?? 'Invalid token', ar: 'حدث خطا ما' },
      ],
    });
    socket.disconnect();
  }
  private async getSocket({ userId }: { userId: string }) {
    const socketId = await this.cacheService.get<string>(userId);
    return socketId ? this.server.sockets.sockets.get(socketId) : null;
  }
  private async getUserId({ socket }: { socket: Socket }) {
    const access = socket.handshake.headers['x-server-access'];
    if (access != process.env.SERVER_ACCESS)
      throw new Error('invaild connection');
    const token = socket.handshake.headers.authorization?.split(' ')?.at(-1);
    return getClientId(token);
  }
  private async sendMessage({ message, userId }) {
    const { receiverId, senderId } = message?.chat ?? {};
    const sendTo = userId == senderId ? receiverId : senderId;
    const receiverSocket = await this.getSocket({ userId: sendTo });
    receiverSocket?.emit('message', message);
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    try {
      const { id: userId } = await this.getUserId({ socket });
      this.cacheService.set(`socket-id-of-${userId}`, socket.id, 3600);
      this.cacheService.addToSet('users:connected', [userId]);
      this.chatsService.userConnect({ userId });
      this.logger.log(`Conected: ${userId}`);
    } catch (error: any) {
      socket.emit('error', {
        messages: [{ en: error?.message ?? 'Invalid token', ar: 'حدث خطا ما' }],
      });
      socket.disconnect();
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody(new ValidationPipe()) { chatId, content }: MessageDTO,
    @Client({ idOnly: true }) userId: string,
  ) {
    try {
      await this.chatsService.isVaildMessage({ userId, chatId });
      const createdMessage = await this.chatsService.createMessage({
        userId,
        chatId,
        content,
      });
      this.sendMessage({ message: createdMessage, userId });
      return createdMessage;
    } catch (error: any) {
      this.handleError({ socket, error });
    }
  }

  @SubscribeMessage('block')
  async handleBlock(
    @ConnectedSocket() socket: Socket,
    @MessageBody(new ValidationPipe()) { blockedId }: { blockedId: string },
    @Client({ idOnly: true }) userId: string,
  ) {
    try {
      await this.chatsService.block({ blockerId: userId, blockedId });
      const receiverSocket = await this.getSocket({ userId: blockedId });
      receiverSocket && receiverSocket.emit('block', { blockerId: userId });
    } catch (error: any) {
      this.handleError({ socket, error });
    }
  }

  @SubscribeMessage('unblock')
  async handleUnblock(
    @ConnectedSocket() socket: Socket,
    @MessageBody(new ValidationPipe()) { blockedId }: { blockedId: string },
    @Client({ idOnly: true }) userId: string,
  ) {
    try {
      await this.chatsService.unblock({ blockerId: userId, blockedId });
      const receiverSocket = await this.getSocket({ userId: blockedId });
      receiverSocket && receiverSocket.emit('unblock', { blockerId: userId });
    } catch (error: any) {
      this.handleError({ socket, error });
    }
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    try {
      const { id: userId } = await this.getUserId({ socket });
      this.chatsService.userConnect({ userId });
      this.cacheService.del(userId);
      this.cacheService.removeFromSet('users:connected', [userId]);
      this.logger.log(`Disconected: ${userId}`);
    } catch (error: any) {
      this.handleError({ socket, error });
    }
  }
}
