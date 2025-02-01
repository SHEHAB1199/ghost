import { Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { CacheService } from 'src/cache/cache.service';
import { CatchError } from 'decorators/CatchError.decorator';
import { AuthStrategy } from './auth.strategy';
import { MailRegisterationDto, MailVerificationDto } from '../dtos/mail.dto';
import { User } from '@prisma/client';
import sendMail from 'utils/sendMail';
import languages from 'languages.json';

@Injectable()
export class MailStrategy extends AuthStrategy {
  constructor(
    private readonly cacheService: CacheService,
    private readonly database: DataBaseService,
  ) {
    super(database);
  }

  canHandle(strategy: string): boolean {
    return strategy == 'mail';
  }

  @CatchError()
  async register({ email, password }: MailRegisterationDto) {
    console.log({ email, password });
    const otp = this.generateOtp(5);
    await sendMail({ to: email, subject: 'otp', text: `this is otp ${otp}` });
    await this.cacheService.set(email, { password, otp }, 3 * 60);
    return languages['otp-mail-send'];
  }

  @CatchError()
  async verify({ email, otp }: MailVerificationDto): Promise<User | null> {
    const cachedValue = await this.cacheService.get<{
      password: string;
      otp: number;
    }>(email);

    if (cachedValue && cachedValue?.otp == otp)
      return this.createUser({ email, password: cachedValue.password });
    return null;
  }

  @CatchError()
  private async createUser({ email, password }: MailRegisterationDto) {
    const username = await this.generateUsername();
    const user = await this.database.user.create({
      data: { username },
    });
    await this.database.authByEmail.create({
      data: {
        email,
        password,
        userId: user.id,
      },
    });
    return user;
  }
}
