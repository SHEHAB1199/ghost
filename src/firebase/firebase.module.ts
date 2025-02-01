import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { firebaseProviders } from './firebase.provider';

@Global()
@Module({
  providers: [FirebaseService, ...firebaseProviders],
  exports: [FirebaseService],
})
export class FirebaseModule {}
