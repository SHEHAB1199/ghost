import { Controller, Get, Query } from '@nestjs/common';
import { CloudService } from './cloud.service';
import { UserDecorator } from 'decorators/user.decorator';
import { v4 as uuidv4 } from 'uuid';

@Controller('cloud')
export class CloudController {
  constructor(private readonly cloudService: CloudService) {}

  @Get('generate-sas')
  async getSASToken(
    @Query('filename') filename: string,
    @UserDecorator({ idOnly: true }) userID: string,
  ) {
    return await this.cloudService.generateSASToken(
      `${userID}/${uuidv4()}-${filename}`,
    );
  }
}
