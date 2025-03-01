import { Injectable } from '@nestjs/common';
import { MessageContent } from '@prisma/client';
import { CatchError } from 'decorators/CatchError.decorator';
import { DataBaseService } from 'src/database/database.service';
import languages from 'languages.json';
import { deepCopy } from 'utils/deepCopy';

@Injectable()
export class ChatsService {
  constructor(private readonly database: DataBaseService) {}

  @CatchError()
  async getChats({
    limit,
    skip,
    userId,
  }: {
    limit: number;
    skip: number;
    userId: string;
  }) {
    return this.database.chat.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
                lastConnect: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            lastConnect: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            lastConnect: true,
          },
        },
      },
      skip,
      take: limit,
    });
  }

  @CatchError()
  async getMessages({
    limit,
    skip,
    userId,
    chatId,
  }: {
    limit: number;
    skip: number;
    userId: string;
    chatId: string;
  }) {
    return this.database.message.findMany({
      where: {
        chat: {
          id: chatId,
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            lastConnect: true,
          },
        },
      },
      take: limit,
      skip,
    });
  }

  @CatchError()
  async isVaildMessage({ userId, chatId }: { userId: string; chatId: string }) {
    const count = await this.database.chat.count({
      where: {
        id: chatId,
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    });
    if (count == 0) throw { messages: [languages['message-invaild']] };
  }

  @CatchError()
  createMessage({
    userId,
    chatId,
    content,
  }: {
    userId: string;
    chatId: string;
    content: Partial<MessageContent>;
  }) {
    return this.database.message.create({
      data: {
        senderId: userId,
        chatId,
        content,
      },
      include: {
        chat: true,
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            lastConnect: true,
          },
        },
      },
    });
  }

  @CatchError()
  async block({
    blockerId,
    blockedId,
  }: {
    blockerId: string;
    blockedId: string;
  }) {
    return this.database.block.create({
      data: {
        blockerId,
        blockedId,
      },
    });
  }

  @CatchError()
  async unblock({
    blockerId,
    blockedId,
  }: {
    blockerId: string;
    blockedId: string;
  }) {
    return this.database.block.delete({
      where: {
        blockerId_blockedId: {
          blockerId,
          blockedId,
        },
      },
    });
  }

  @CatchError()
  async connectedUsers({
    userId,
    connected,
  }: {
    userId: string;
    connected: string[];
  }) {
    const users = deepCopy(
      await this.database.user.findMany({
        where: {
          id: { in: connected },
          following: {
            some: { followingId: userId },
          },
        },
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
          lastConnect: true,
        },
      }),
    );
    for (const index in users) {
      const chat = await this.database.chat.findFirst({
        where: {
          OR: [
            { senderId: userId, receiverId: users[index].id },
            { receiverId: userId, senderId: users[index].id },
          ],
        },
        select: { id: true },
      });
      if (chat) users[index].chatId = chat.id;
    }
    return users;
  }

  @CatchError()
  async userConnect({ userId }: { userId: string }) {
    return this.database.user.update({
      where: { id: userId },
      data: { lastConnect: new Date() },
    });
  }

  @CatchError()
  createChat({
    senderId,
    receiverId,
  }: {
    senderId: string;
    receiverId: string;
  }) {
    return this.database.chat.create({
      data: {
        senderId,
        senderStatus: {
          lastSeen: new Date(),
        },
        receiverId,
        receiverStatus: {
          lastSeen: new Date(),
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            lastConnect: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            lastConnect: true,
          },
        },
      },
    });
  }
}
