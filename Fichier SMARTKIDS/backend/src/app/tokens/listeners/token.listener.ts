import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EmailMessengerService } from 'src/app/messenger/email-messenger.service';
import {
  OTPCreatedEvent,
  OTP_CREATED_EVENT_NAME,
} from '../events/otp-emailcreate.event';

@Injectable()
export class TokenListener {
  constructor(private readonly emailMessenger: EmailMessengerService) {}

  @OnEvent(OTP_CREATED_EVENT_NAME)
  async handleOtpCreated(event: OTPCreatedEvent) {
    const { user, otp, type } = event;

    await this.emailMessenger.sendOTP({
      otp,
      user,
      type,
    });
  }
}
