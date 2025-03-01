import { Injectable } from '@nestjs/common';
import { CatchError } from 'decorators/CatchError.decorator';
import { MailStrategy } from './strategies/mail.strategy';
import { AuthStrategy } from './strategies/auth.strategy';
import { getHandler } from 'utils/getHandler';
import { RegisterArg, VerifyArg } from './dtos/auth.dto';
import languages from 'languages.json';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  stratiges: AuthStrategy[] = [];
  constructor(
    private readonly mailStrategy: MailStrategy,
    private readonly jwtService: JwtService,
  ) {
    this.stratiges.push(this.mailStrategy);
  }

  @CatchError()
  async login(arg: RegisterArg, stratigy: string) {
    const handler = getHandler<AuthStrategy>(this.stratiges, stratigy);
    const { user, messages } = await handler.login(arg);
    if (user)
      return {
        token: this.jwtService.sign({ id: user.id }),
        user,
        messages,
      };
    return { messages };
  }

  @CatchError()
  async register(arg: RegisterArg, stratigy: string) {
    const handler = getHandler<AuthStrategy>(this.stratiges, stratigy);
    return handler.register(arg);
  }

  @CatchError()
  async verify(arg: VerifyArg, stratigy: string) {
    const handler = getHandler<AuthStrategy>(this.stratiges, stratigy);
    const { user, messages } = await handler.verify(arg);
    if (user)
      return {
        token: this.jwtService.sign({ id: user.id }),
        user,
        messages,
      };
    return { messages: [languages['otp-invaild']] };
  }
}
