import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CatchError, Handler } from 'decorators/CatchError.decorator';

@Injectable()
export class FirebaseService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  @CatchError(generateErrorHandler('Something wrong'))
  getFirestore() {
    return this.firebaseAdmin.firestore();
  }

  @CatchError(generateErrorHandler('Something wrong'))
  private generateMessage({
    token,
    title,
    body,
    data = {},
  }: {
    token: string;
    title: string;
    body: string;
    data?: any;
  }) {
    const message: admin.messaging.Message = {
      token: token,
      notification: {
        title: title,
        body: body,
      },
      data,
    };
    return message;
  }

  @CatchError(generateErrorHandler('Something wrong'))
  private generateMulticastMessage({
    tokens,
    title,
    body,
    data = {},
  }: {
    tokens: string[];
    title: string;
    body: string;
    data?: any;
  }) {
    const message: admin.messaging.MulticastMessage = {
      tokens: tokens,
      notification: {
        title: title,
        body: body,
      },
      data,
    };
    return message;
  }

  @CatchError(generateErrorHandler('Invalid token'))
  async verifyIdToken(idToken: string) {
    try {
      const decodedToken = await this.firebaseAdmin
        .auth()
        .verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {}
  }

  @CatchError(generateErrorHandler('Failed to send notification'))
  async sendNotification({
    token,
    title,
    body,
    data = {},
  }: {
    token: string;
    title: string;
    body: string;
    data?: any;
  }) {
    const response = await this.firebaseAdmin
      .messaging()
      .send(this.generateMessage({ token, title, body, data }));
    return response;
  }

  @CatchError(generateErrorHandler('Failed to send notifications'))
  async sendNotificationToMultipleDevices({
    tokens,
    title,
    body,
    data = {},
  }: {
    tokens: string[];
    title: string;
    body: string;
    data?: any;
  }) {
    const response = await admin
      .messaging()
      .sendEachForMulticast(
        this.generateMulticastMessage({ tokens, title, body, data }),
      );
    return response;
  }
}

function generateErrorHandler(message: string): Handler {
  return (error) => {
    console.error(error);
    throw new Error(message);
  };
}
