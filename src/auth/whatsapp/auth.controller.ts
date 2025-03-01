import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('send-otp')
  async sendOTP(@Body('phone') phoneNumber: string) {
    return this.whatsappService.sendOTP(phoneNumber.trim());
  }
  
  @Post('verify-otp')
  async verifyOtp(
    @Query('phone') phone: string, 
    @Query('otp') otp: string
  ): Promise<string> {
    return this.whatsappService.verifyOtp(phone, otp);
  }
}
