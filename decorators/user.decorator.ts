import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { DataBaseService } from 'src/database/database.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CacheService } from 'src/cache/cache.service';
import { UnauthorizedException } from '@nestjs/common';

export type UserType = User & { following: string[] };
export type UserDecoratorReturnType = Promise<UserType | string>;

export const UserDecorator = createParamDecorator(
  async (
    { idOnly = false }: { idOnly?: boolean } = { idOnly: false },
    ctx: ExecutionContext,
  ): UserDecoratorReturnType => {
    try {
      const token = getToken(ctx);
      const { id } = await jwtService.verifyAsync<{ id: string }>(token);
      const userCached = await cacheService.get<UserDecoratorReturnType>(id);
      if (userCached) return idOnly ? id : userCached;
      const user = await databaseService.user.findUnique({
        where: { id },
        include: {
          following: {
            select: {
              followingId: true,
            },
          },
        },
      });
      const following = user.following.map((f) => f.followingId);
      delete user.following;
      await cacheService.set(id, { user, ...following }, 60 * 60 * 24);
      return idOnly ? user.id : { ...user, following };
    } catch (error: any) {
      console.error(error);
      handleError(ctx, error);
    }
  },
);

const databaseService = new DataBaseService(new EventEmitter2());
databaseService.onModuleInit();
const cacheService = new CacheService();
cacheService.onModuleInit();
const jwtService = new JwtService({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '60m' },
});

const getToken = (ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<FastifyRequest>();
  const token = req.headers['authorization']?.split(' ')?.at(1);
  if (!token) throw new UnauthorizedException('No token provided');
  return token;
};

const handleError = (ctx: ExecutionContext, error: any) => {
  throw new UnauthorizedException(error?.message ?? 'Invalid token');
};
