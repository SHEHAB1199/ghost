import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from './cache/cache.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
// import { JwtModule } from '@nestjs/jwt';
import { ReelsModule } from './reels/reels.module';
import { UserModule } from './user/user.module';
import { PostsModule } from './posts/posts.module';
import { CloudModule } from './cloud/cloud.module';
import { ChatsModule } from './chats/chats.module';
import { StreamModule } from './stream/stream.module';
import { WhatsappModule } from './auth/whatsapp/whatsapp.module';
import { PoliceModule } from './police/police.module';
@Module({
  imports: [
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: { expiresIn: '360 days' },
    // }),
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    AuthModule,
    ReelsModule,
    DatabaseModule,
    HttpModule,
    CacheModule,
    UserModule,
    PostsModule,
    CloudModule,
    ChatsModule,
    StreamModule,
    WhatsappModule,
    PoliceModule
  ],
  controllers: [],
})
export class AppModule {}
