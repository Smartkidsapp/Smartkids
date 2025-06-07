import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { EmailMessengerService } from './email-messenger.service';
import { FirebaseService } from './firebase.service';
import { Job } from 'bull';
import { ISendMailOptions } from '@nestjs-modules/mailer';

@Processor('messenger')
export class MessengerProcessor {
  private readonly logger = new Logger(MessengerProcessor.name);
  constructor(
    private readonly emailMessenger: EmailMessengerService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Process('send-email')
  async handleSendMail(job: Job<ISendMailOptions>) {
    this.logger.debug('send-email processing...');
    this.logger.debug(job.data);
    await this.emailMessenger.send(job.data);
    this.logger.debug('send-email completed');
  }

  @Process('send-push-notification')
  async handleSendPushNotification(
    job: Job<{
      title: string;
      content: string;
      userId: string;
    }>,
  ) {
    this.logger.debug('send-push-notification processing...');
    this.logger.debug(job.data);
    await this.firebaseService.sendNotification(job.data);
    this.logger.debug('send-push-notification completed');
  }

  @Process('send-push-notification-to-multiple-users')
  async handleSendPushNotificationToMultipleUsers(
    job: Job<{
      title: string;
      content: string;
      userIds: string[];
    }>,
  ) {
    this.logger.debug('send-push-notification-to-multiple-users processing...');
    this.logger.debug(job.data);
    await this.firebaseService.sendNotificationToMultipleUsers(job.data);
    this.logger.debug('send-push-notification-to-multiple-users completed');
  }
}
