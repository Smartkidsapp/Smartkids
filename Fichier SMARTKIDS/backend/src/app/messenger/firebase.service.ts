import { Injectable } from '@nestjs/common';
import { App, applicationDefault, initializeApp } from 'firebase-admin/app';
import { MulticastMessage, getMessaging } from 'firebase-admin/messaging';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FCMToken } from '../users/schemas/Fcm-token.schemas';

@Injectable()
export class FirebaseService {
  private readonly firebaseApp: App;

  constructor(
    @InjectModel(FCMToken.name) private readonly fcmTokenModel: Model<FCMToken>,
  ) {
    this.firebaseApp = initializeApp({
      credential: applicationDefault(),
    });
  }

  async sendNotification({
    content,
    title,
    userId,
  }: {
    title: string;
    content: string;
    userId: string;
  }) {
    const fcmTokens = await this.fcmTokenModel.find({
      user: new Types.ObjectId(userId),
    });

    if (!fcmTokens?.length) {
      return;
    }

    const tokens = fcmTokens.map((t) => t.value);

    const firebaseMessage: MulticastMessage = {
      data: {
        content: content,
      },
      tokens,
      notification: {
        title: title,
        body: content,
      },
      android: {
        priority: 'high',
      },
    };
    await getMessaging().sendEachForMulticast(firebaseMessage);
  }

  async sendNotificationToMultipleUsers({
    content,
    title,
    userIds,
  }: {
    title: string;
    content: string;
    userIds: string[];
  }) {
    if (userIds.length === 0) return;

    const usersfcmTokens = await Promise.all(
      userIds.map((userId) =>
        this.fcmTokenModel.find({
          user: new Types.ObjectId(userId),
        }),
      ),
    );

    const tokens = usersfcmTokens.reduce((acc, next) => {
      const tokenValues = next.map((p) => p.value);
      return [...acc, ...tokenValues];
    }, [] as string[]);

    if (tokens.length === 0) {
      return;
    }

    const firebaseMessage: MulticastMessage = {
      data: {
        content: content,
      },
      tokens,
      notification: {
        title: title,
        body: content,
      },
      android: {
        priority: 'high',
      },
    };
    await getMessaging().sendEachForMulticast(firebaseMessage);
  }
}
