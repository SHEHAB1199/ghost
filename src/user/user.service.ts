import { Injectable } from '@nestjs/common';
import { CatchError } from 'decorators/CatchError.decorator';
import { DataBaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly database: DataBaseService) {}

  @CatchError()
  async follow({
    followingId,
    userId,
  }: {
    followingId: string;
    userId: string;
  }) {
    return this.database.follower.create({
      data: { followerId: userId, followingId },
    });
  }

  @CatchError()
  async unfollow({
    followingId,
    userId,
  }: {
    followingId: string;
    userId: string;
  }) {
    return this.database.follower.delete({
      where: { followerId_followingId: { followerId: userId, followingId } },
    });
  }
}
