import { Controller, Get, Delete, Param, Patch, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UserDecorator } from 'decorators/user.decorator';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
    async getNotification(
      @UserDecorator({ idOnly: true }) userID: string,
      @Query('type') notificationType?: string, // type is optional
    ) {
      const filter: any = {
        userIDs: { has: userID },
      };

      if (notificationType) {
        filter.type = notificationType; // Add type filter only if provided
      }

      return await this.notificationService.getNotifications(filter);
    }



  @Patch(':notificationID/seen')
  async markNotificationAsSeen(
    @UserDecorator({ idOnly: true }) userID: string,
    @Param('notificationID') notificationID: string,
  ) {
    return await this.notificationService.markNotificationAsSeen({
      userIDs: { has: userID },
      id: notificationID,
    });
  }

  @Delete(':notificationID')
  async deleteNotification(
    @UserDecorator({ idOnly: true }) userID: string,
    @Param('notificationID') notificationID?: string,
  ) {
    return await this.notificationService.deleteNotifications({
      userIDs: { has: userID },
      id: notificationID,
    }); 
  }

  @Delete()
  async deleteAllNotifications(
    @UserDecorator({ idOnly: true }) userID: string,
  ) {
    return await this.notificationService.deleteNotifications({
      userIDs: { has: userID },
    });
  }
}