import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ReelsService } from './reels.service';
import { CreateCommentReelDTO, CreateReelDTO, ReelsFilter } from './reels.dto';
import { UserDecorator } from 'decorators/user.decorator';

@Controller('reels')
export class ReelsController {
  constructor(private reelsService: ReelsService) {}

  @Post()
  async createReel(
    @Body(new ValidationPipe()) body: CreateReelDTO,
    @UserDecorator({ idOnly: true }) userId: string,
  ) {
    return this.reelsService.createReel({ userId, ...body });
  }

  @Get('comments/:reelId')
  async getCommentReel(@Param('reelId') reelId: string) {
    return this.reelsService.getCommentReel({ reelId });
  }

  @Post('comments/:reelId')
  async CreateCommentReel(
    @Param('reelId') reelId: string,
    @Body(new ValidationPipe()) body: CreateCommentReelDTO,
    @UserDecorator({ idOnly: true }) userId: string,
  ) {
    const { content } = body;
    return this.reelsService.createCommentReel({ userId, reelId, content });
  }

  @Post('save/:reelId')
  async saveReel(
    @UserDecorator({ idOnly: true }) userId: string,
    @Param('reelId') reelId: string,
  ) {
    return this.reelsService.saveReel({ userId, reelId });
  }

  @Delete('save/:reelId')
  async unsaveReel(
    @UserDecorator({ idOnly: true }) userId: string,
    @Param('reelId') reelId: string,
  ) {
    return this.reelsService.unsaveReel({ userId, reelId });
  }

  @Post('love/:reelId')
  async loveReel(
    @UserDecorator({ idOnly: true }) userId: string,
    @Param('reelId') reelId: string,
  ) {
    return this.reelsService.loveReel({ userId, reelId });
  }

  @Delete('love/:reelId')
  async unloveReel(
    @UserDecorator({ idOnly: true }) userId: string,
    @Param('reelId') reelId: string,
  ) {
    return this.reelsService.unloveReel({ userId, reelId });
  }

  @Get()
  async getReels(
    @UserDecorator({ idOnly: true }) userId: string,
    @Query('limit') limit: number,
    @Query('skip') skip: number,
    @Query('filter') filter: ReelsFilter,
  ) {
    return this.reelsService.getReels({ limit, skip, filter, userId });
  }
}
