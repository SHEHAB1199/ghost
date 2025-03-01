import { MessageContent } from '@prisma/client';

export class MessageDTO {
  content: Partial<MessageContent>;
  chatId: string;
}
