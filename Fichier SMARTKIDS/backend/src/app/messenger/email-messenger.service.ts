import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/core/config';
import { UserDocument } from '../users/schemas/users.schema';
import { OTPType } from '../tokens/schemas/otp.schema';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class EmailMessengerService {
  private readonly logger = new Logger(EmailMessengerService.name);

  constructor(
    private readonly configService: ConfigService<AppConfig>,
    private readonly mailerService: MailerService,
    @InjectQueue('messenger') private readonly messengerQueue: Queue,
  ) {}

  async sendOTP({
    otp,
    user: { name, email },
    type,
  }: {
    user: UserDocument;
    otp: string;
    type: OTPType;
  }) {
    const formatedOtp = `${otp.slice(0, 3)} ${otp.slice(3)}`;
    const title =
      type === OTPType.EMAIL_VERIFICATION
        ? `${formatedOtp} est votre code vérification d'inscription.`
        : `${formatedOtp} est votre code réinitialisation de mot de passe.`;

    const template =
      type === OTPType.EMAIL_VERIFICATION ? 'email-otp' : 'password-otp';

    return this.messengerQueue.add(
      'send-email',
      {
        to: `"${name}" <${email}>`,
        context: {
          otp: formatedOtp,
          name,
          title,
        },
        template,
        subject: title,
      },
      {
        removeOnComplete: true,
      },
    );
  }

  /**
   * Send a welcome message to a user with an otp to verify
   * his email address.
   */
  async sendWelcomeMessage({
    otp,
    user: { name, email },
  }: {
    user: UserDocument;
    otp: string;
  }) {
    return this.messengerQueue.add(
      'send-email',
      {
        to: `"${name}" <${email}>`,
        context: {
          otp,
          name,
          title: `Bienvenue, ${name}`,
        },
        template: 'welcome',
        subject: `Bienvenue, ${name}`,
      },
      {
        removeOnComplete: true,
      },
    );
  }

  /**
   * Generic function to send all emails,
   * Setup base context for all email templates.
   */
  async send(options_: ISendMailOptions) {
    const options: ISendMailOptions = {
      ...options_,
    };

    if (!options.context) {
      options.context = {};
    }

    options.context.logo_url = this.configService.get('APP_LOGO');
    options.context.server_url = this.configService.get('SERVER_URL');
    options.context.contact_email = this.configService.get('CONTACT_EMAIL');
    options.context.contact_phone = this.configService.get('CONTACT_PHONE');

    this.logger.debug('SENDING' + JSON.stringify({ options }, null, 2));

    return this.mailerService
      .sendMail({
        ...options,
      })
      .catch((error) => {
        this.logger.error('ERROR SENDING' + JSON.stringify({ error }, null, 2));
        this.logger.error(error);
      });
  }
}
