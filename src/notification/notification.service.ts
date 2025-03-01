import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Prisma } from '@prisma/client';
import { DataBaseService } from 'src/database/database.service';
import { CatchError } from 'decorators/CatchError.decorator';
import Expo from 'expo-server-sdk';

@Injectable()
export class NotificationService {
  private expo: Expo;

  constructor(private readonly database: DataBaseService) {
    this.expo = new Expo(); // Initialize Expo SDK
  }

  @OnEvent('notification.create')
  @CatchError()
  async sendNotification(notification: any) {
    // Extract tokens from users
    const tokens = notification.users
      .map((user: any) => user.notificationsTokens.map((token: any) => token.token)) // Extract tokens
      .flat()
      .filter((token: string) => Expo.isExpoPushToken(token)); // Validate tokens

    if (tokens.length === 0) {  // Check if there are any valid tokens
      throw new Error('No valid Expo push tokens found.');
    }

    // Create messages for Expo
    const messages = tokens.map((token: string) => ({
      to: token,
      sound: 'default',
      title: notification.title.ar,
      body: notification.body.ar,
      data: notification.data,
      notificationType: notification.type,
    }));

    // Send notifications using Expo
    const chunks = this.expo.chunkPushNotifications(messages);
    const responses = [];

    for (const chunk of chunks) {
      try {
        const response = await this.expo.sendPushNotificationsAsync(chunk);
        responses.push(...response);
      } catch (error) {
        console.error('Error sending push notification:', error);
      }
    }

    return responses;
  }

  @CatchError()
  async deleteNotifications(where: Prisma.NotificationWhereInput) {
    const response = await this.database.notification.deleteMany({ where });
    return response;
  }

  @CatchError()
  async getNotifications(where: Prisma.NotificationWhereInput) {
    const response = await this.database.notification.findMany({ where });
    return response;
  }

  @CatchError()
  async markNotificationAsSeen(where: Prisma.NotificationWhereInput) {
    const response = await this.database.notification.updateMany({
      where,
      data: { seen: true },
    });
    return response;
  }
}