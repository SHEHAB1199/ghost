import { Controller, Delete, Param, Patch } from '@nestjs/common';
import { UserDecorator } from 'decorators/user.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch('follow/:followingId')
  async follow(
    @Param('followingId') followingId: string,
    @UserDecorator({ idOnly: true }) userId: string,
  ) {
    return this.userService.follow({ followingId, userId });
  }

  @Delete('follow/:followingId')
  async unfollow(
    @Param('followingId') followingId: string,
    @UserDecorator({ idOnly: true }) userId: string,
  ) {
    return this.userService.unfollow({ followingId, userId });
  }
}
