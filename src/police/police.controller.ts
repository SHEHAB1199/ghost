import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { PoliceService } from './police.service';

@Controller('police')
export class PoliceController {
  constructor(private readonly policeService: PoliceService) {}

  // Get all police users
  @Get()
  async getPoliceUsers() {
    return this.policeService.getPoliceUsers();
  }

  // Get a single police user by ID
  @Get(':id')
  async getPoliceUserById(@Param('id') id: string) {
    return this.policeService.getPoliceUserById(id);
  }

  // Ban a user
  @Post('ban-user')
  async banUser(
    @Body('userId') userId: string,
    @Body('policeId') policeId: string,
    @Body('reason') reason?: string,
  ) {
    return this.policeService.banUser(userId, policeId, reason);
  }

  // Unban a user
  @Post('unban-user')
  async unbanUser(
    @Body('userId') userId: string,
    @Body('policeId') policeId: string,
  ) {
    return this.policeService.unbanUser(userId, policeId);
  }

  // View all reports
  @Get('reports')
  async viewReports() {
    return this.policeService.viewReports();
  }

  // Promote a user to police
  @Post('promote-user/:userId')
  async promoteUserToPolice(@Param('userId') userId: string) {
    return this.policeService.promoteUserToPolice(userId);
  }

  // View all banned users
  @Get('banned-users')
  async viewBannedUsers() {
    return this.policeService.viewBannedUsers();
  }
}