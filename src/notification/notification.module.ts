import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { DataBaseService } from 'src/database/database.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, DataBaseService],
  exports: [NotificationService],
})
export class NotificationModule {}