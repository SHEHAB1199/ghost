import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import puppeteer from 'puppeteer'; // Ensure puppeteer is installed: npm install puppeteer
import { DataBaseService } from 'src/database/database.service';

@Injectable()
export class WhatsappService {
  private client: Client;
  private readonly logger = new Logger(WhatsappService.name);

  constructor(private readonly prisma: DataBaseService) {
    this.initializeClient().then(() => {
      this.logger.log('WhatsApp client initialized successfully.');
    }).catch((error) => {
      this.logger.error('Failed to initialize WhatsApp client:', error);
    });
  }

  private async initializeClient() {
    const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'], dumpio: true });

    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true, // ✅ Optional: Set to false to see the browser
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });
    

    this.client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
      this.logger.log('QR code generated. Scan it with your phone.');
    });

    this.client.on('ready', () => {
      this.logger.log('WhatsApp client is ready.');
    });

    this.client.on('authenticated', () => {
      this.logger.log('Client authenticated.');
    });

    this.client.on('auth_failure', (msg) => {
      this.logger.error('Authentication failed:', msg);
    });

    await this.client.initialize(); // Ensure client is awaited
  }

  async sendOTP(phoneNumber: string): Promise<string> {
    try {
      // Remove non-numeric characters and ensure correct format
      const sanitizedPhoneNumber = phoneNumber.replace(/\D/g, ''); 
  
      if (!/^(\d{11,15})$/.test(sanitizedPhoneNumber)) {
        throw new Error('Invalid phone number format');
      }
  
      const recipient = `${sanitizedPhoneNumber}@c.us`; // Format for WhatsApp
      console.log(`Sending OTP to: ${recipient}`);
  
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP
      const message = `Your OTP code is: ${otp}`;
      await this.client.sendMessage(recipient, message);
  
      const otpExpires = new Date();
      otpExpires.setMinutes(otpExpires.getMinutes() + 5);
  
      // Save OTP in database
      await this.prisma.user.update({
        where: { username: sanitizedPhoneNumber },
        data: { otp: otp.toString(), otpExpires },
      });
  
      return `OTP sent to ${sanitizedPhoneNumber}`;
    } catch (error) {
      this.logger.error('Error sending OTP:', error);
      throw new Error((error as any).message || 'Failed to send OTP');
    }
  }
  

  async verifyOtp(phoneNumber: string, otp: string): Promise<string> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { phoneNumber },
      });

      if (!user) throw new NotFoundException('User not found');
      if (user.otp !== otp) throw new UnauthorizedException('Invalid OTP');
      if (user.otpExpires && user.otpExpires < new Date()) throw new UnauthorizedException('OTP expired');

      await this.prisma.user.update({
        where: { username: phoneNumber.trim() },
        data: { otp: null, otpExpires: null },
      });

      return 'OTP verified successfully';
    } catch (error) {
      this.logger.error('Error verifying OTP:', error);
      throw new Error((error as any).message);
    }
  }
}
