import { Injectable } from '@nestjs/common';
import { CatchError } from 'decorators/CatchError.decorator';
import { DataBaseService } from 'src/database/database.service';
import languages from 'languages.json';

@Injectable()
export class PostsService {
  constructor(private readonly database: DataBaseService) {}

  @CatchError()
  async getPosts({
    limit,
    skip,
    userId,
  }: {
    limit: number;
    skip: number;
    userId: string;
  }) {
    const posts = await this.database.post.findMany({
      orderBy: { createdAt: 'desc' },
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

    return posts.map((post) => {
      const isUserSaved = post.saves.length > 0;
      const isUserLoves = post.loves.length > 0;
      const count = post._count;
      delete post.saves;
      delete post.loves;
      delete post._count;
      delete post.publisherId;
      return {
        ...post,
        ...count,
        isUserSaved,
        isUserLoves,
      };
    });
  }

  @CatchError()
  async createPost({
    text,
    images,
    userId,
  }: {
    text?: string;
    images?: string[];
    userId: string;
  }) {
    const post = await this.database.post.create({
      data: {
        content: {
          text,
          images,
        },
        publisherId: userId,
      },
      include: {
        publisher: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
    });
    return {
      post: {
        ...post,
        loves: 0,
        saves: 0,
        comments: 0,
        isUserSaved: false,
        isUserLoves: false,
        postComments: [],
      },
      messages: [{ content: languages['post-created'], isSuccess: true }],
    };
  }

  @CatchError()
  async createCommentPost({
    content,
    postId,
    userId,
  }: {
    content: string;
    postId: string;
    userId: string;
  }) {
    return this.database.postComment.create({
      data: { content, postId, userId },
    });
  }

  @CatchError()
  async getCommentPost({ postId }: { postId: string }) {
    return this.database.postComment.findMany({
      where: { postId },
    });
  }

  @CatchError()
  async savePost({ postId, userId }: { postId: string; userId: string }) {
    return this.database.postSave.create({
      data: { postId, userId },
    });
  }

  @CatchError()
  async unsavePost({ postId, userId }: { postId: string; userId: string }) {
    return this.database.postSave.delete({
      where: { postId_userId: { postId, userId } },
    });
  }

  @CatchError()
  async lovePost({ postId, userId }: { postId: string; userId: string }) {
    return this.database.postLove.create({
      data: { postId, userId },
    });
  }

  @CatchError()
  async unlovePost({ postId, userId }: { postId: string; userId: string }) {
    return this.database.postLove.delete({
      where: { postId_userId: { postId, userId } },
    });
  }
}
