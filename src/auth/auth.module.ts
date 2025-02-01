import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { MailStrategy } from './strategies/mail.strategy';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '360 days' },
    }),
  ],
  providers: [AuthService, MailStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
