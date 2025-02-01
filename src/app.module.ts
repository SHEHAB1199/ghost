import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from './cache/cache.module';
import { UserModule } from './user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
// import { PreferenceModule } from './preference/preference.module';
// import { CloudModule } from './cloud/cloud.module';
// import { FirebaseModule } from './firebase/firebase.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '360 days' },
    }),
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    AuthModule,
    DatabaseModule,
    HttpModule,
    CacheModule,
    UserModule,
    // PreferenceModule,
    // CloudModule,
    // FirebaseModule,
    NotificationModule,
  ],
  controllers: [],
})
export class AppModule {}
