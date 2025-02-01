import * as admin from 'firebase-admin';
import { Provider } from '@nestjs/common';
import serviceAccount from 'firebase-service-account.json';

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const firebaseProviders: Provider[] = [
  {
    provide: 'FIREBASE_ADMIN',
    useValue: firebaseAdmin,
  },
];
