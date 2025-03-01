import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './auth.controller';

@Module({
  controllers: [WhatsappController],
  providers: [WhatsappService],
})
export class WhatsappModule {}
