import { Injectable } from '@nestjs/common';
import { CatchError } from 'decorators/CatchError.decorator';
import { DataBaseService } from 'src/database/database.service';
import { ReelsFilter } from './reels.dto';

@Injectable()
export class ReelsService {
  constructor(private readonly database: DataBaseService) {}

  @CatchError()
  async getReels({
    limit,
    skip,
    filter,
    userId,
  }: {
    limit: number;
    skip: number;
    userId: string;
    filter: ReelsFilter;
  }) {
    console.log({ filter });
    const reels = await this.database.reel.findMany({
      include: {
        publisher: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            saves: true,
            loves: true,
            comments: true,
          },
        },
        saves: {
          where: {
            userId: userId,
          },
          take: 1,
        },
        loves: {
          where: {
            userId: userId,
          },
          take: 1,
        },
      },
      skip,
      take: limit,
    });

    return reels.map((reel) => {
      const isUserSaved = reel.saves.length > 0;
      const isUserLoves = reel.loves.length > 0;
      const count = reel._count;
      delete reel.saves;
      delete reel.loves;
      delete reel._count;
      delete reel.publisherId;
      return {
        ...reel,
        ...count,
        isUserSaved,
        isUserLoves,
      };
    });
  }

  @CatchError()
  async createReel({
    content,
    url,
    userId,
  }: {
    content: string;
    url: string;
    userId: string;
  }) {
    return this.database.reel.create({
      data: {
        content,
        url,
        publisherId: userId,
      },
    });
  }

  @CatchError()
  async createCommentReel({
    content,
    reelId,
    userId,
  }: {
    content: string;
    reelId: string;
    userId: string;
  }) {
    return this.database.reelComment.create({
      data: { content, reelId, userId },
    });
  }

  @CatchError()
  async getCommentReel({ reelId }: { reelId: string }) {
    return this.database.reelComment.findMany({
      where: { reelId },
    });
  }

  @CatchError()
  async saveReel({ reelId, userId }: { reelId: string; userId: string }) {
    return this.database.reelSave.create({
      data: { reelId, userId },
    });
  }

  @CatchError()
  async unsaveReel({ reelId, userId }: { reelId: string; userId: string }) {
    return this.database.reelSave.delete({
      where: { reelId_userId: { reelId, userId } },
    });
  }

  @CatchError()
  async loveReel({ reelId, userId }: { reelId: string; userId: string }) {
    return this.database.reelLove.create({
      data: { reelId, userId },
    });
  }

  @CatchError()
  async unloveReel({ reelId, userId }: { reelId: string; userId: string }) {
    return this.database.reelLove.delete({
      where: { reelId_userId: { reelId, userId } },
    });
  }
}
