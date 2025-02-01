import { MailRegisterationDto, MailVerificationDto } from './mail.dto';

export enum AuthStrategies {
  Mail = 'mail',
}
export type RegisterArg = MailRegisterationDto;
export type VerifyArg = MailVerificationDto;
