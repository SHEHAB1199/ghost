import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { UserDecorator } from 'decorators/user.decorator';
import { CreateCommentPostDTO, CreatePostDTO } from './posts.dto';

@Controller('posts')
export class PostController {
  constructor(private postsService: PostsService) {}

  @Get()
  async getPosts(
    @UserDecorator({ idOnly: true }) userId: string,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('skip', ParseIntPipe) skip: number,
  ) {
    return this.postsService.getPosts({ userId, limit, skip });
  }

  @Post()
  async createPost(
    @Body(new ValidationPipe()) body: CreatePostDTO,
    @UserDecorator({ idOnly: true }) userId: string,
  ) {
    return this.postsService.createPost({ userId, ...body });
  }

  @Get('comments/:postId')
  async getCommentPost(@Param('postId') postId: string) {
    return this.postsService.getCommentPost({ postId });
  }

  @Post('comments/:postId')
  async CreateCommentPost(
    @Param('postId') postId: string,
    @Body(new ValidationPipe()) body: CreateCommentPostDTO,
    @UserDecorator({ idOnly: true }) userId: string,
  ) {
    const { content } = body;
    return this.postsService.createCommentPost({ userId, postId, content });
  }

  @Post('save/:postId')
  async savePost(
    @UserDecorator({ idOnly: true }) userId: string,
    @Param('postId') postId: string,
  ) {
    return this.postsService.savePost({ userId, postId });
  }

  @Delete('save/:postId')
  async unsavePost(
    @UserDecorator({ idOnly: true }) userId: string,
    @Param('postId') postId: string,
  ) {
    return this.postsService.unsavePost({ userId, postId });
  }

  @Post('love/:postId')
  async lovePost(
    @UserDecorator({ idOnly: true }) userId: string,
    @Param('postId') postId: string,
  ) {
    return this.postsService.lovePost({ userId, postId });
  }

  @Delete('love/:postId')
  async unlovePost(
    @UserDecorator({ idOnly: true }) userId: string,
    @Param('postId') postId: string,
  ) {
    return this.postsService.unlovePost({ userId, postId });
  }
}
