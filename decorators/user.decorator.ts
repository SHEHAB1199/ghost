import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { DataBaseService } from 'src/database/database.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CacheService } from 'src/cache/cache.service';
import { UnauthorizedException } from '@nestjs/common';

const databaseService = new DataBaseService(new EventEmitter2());
databaseService.onModuleInit();
const cacheService = new CacheService();
cacheService.onModuleInit();
const jwtService = new JwtService({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '60m' },
});

const getToken = (req: FastifyRequest) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) throw new UnauthorizedException('No token provided');
  return token;
};

export const UserDecorator = createParamDecorator(
  async (
    { idOnly = false }: { idOnly?: boolean } = { idOnly: false },
    ctx: ExecutionContext,
  ): Promise<User | string> => {
    const req = ctx.switchToHttp().getRequest<FastifyRequest>();
    try {
      const token = getToken(req);
      const { id } = await jwtService.verifyAsync<{ id: string }>(token);
      if (idOnly) return id;
      const userCached = await cacheService.get<User>(id);
      if (userCached) return userCached;
      const user = await databaseService.user.findUnique({
        where: { id },
      });
      cacheService.set(id, user, 60 * 60 * 24);
      return user;
    } catch (error: any) {
      console.error(error);
      throw new UnauthorizedException(error?.message ?? 'Invalid token');
    }
  },
);
