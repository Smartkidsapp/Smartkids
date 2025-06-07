import { Global, Module } from '@nestjs/common';
import { EmailMessengerService } from './email-messenger.service';
import { FirebaseService } from './firebase.service';
import { BullModule } from '@nestjs/bull';
import { MessengerProcessor } from './messenger.processor';
import { FCMToken, FCMTokenSchema } from '../users/schemas/Fcm-token.schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../users/user.module';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'messenger',
    }),
    MongooseModule.forFeature([
      { name: FCMToken.name, schema: FCMTokenSchema },
    ]),
    UserModule,
  ],
  providers: [EmailMessengerService, FirebaseService, MessengerProcessor],
  exports: [EmailMessengerService, FirebaseService, MessengerProcessor],
})
export class MessengerModule {}
