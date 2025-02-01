import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Patch,
  Query,
  ParseEnumPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDecorator } from 'decorators/user.decorator';
import { User } from '@prisma/client';
import { AuthStrategies } from './dtos/auth.dto';
import { MailRegisterationDto, MailVerificationDto } from './dtos/mail.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async register(
    @Body(new ValidationPipe()) arg: MailRegisterationDto,
    @Query('strategy', new ParseEnumPipe(AuthStrategies))
    strategy: AuthStrategies,
  ) {
    return this.authService.register(arg, strategy);
  }

  @Patch()
  async verify(
    @Body(new ValidationPipe()) arg: MailVerificationDto,
    @Query('strategy', new ParseEnumPipe(AuthStrategies))
    strategy: AuthStrategies,
  ) {
    return this.authService.verify(arg, strategy);
  }

  @Get()
  async verifyToken(@UserDecorator() user: User) {
    return user;
  }
}
