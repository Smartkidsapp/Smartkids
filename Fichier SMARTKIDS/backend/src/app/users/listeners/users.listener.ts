import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  USER_CREATED_EVENT_NAME,
  UserCreatedEvent,
} from '../events/user-created.event';
import { EmailMessengerService } from 'src/app/messenger/email-messenger.service';
import {
  USER_DELETED_EVENT_NAME,
  UserDeletedEvent,
} from '../events/user-deleted.event';
import { OTPType } from 'src/app/tokens/schemas/otp.schema';
import {
  MEDIA_CREATED_EVENT_NAME,
  MediaCreatedEvent,
} from 'src/app/medias/events/media-created.event';
import { MediaTypeEnum } from 'src/app/medias/schemas/media.schema';
import { UserService } from '../user.service';

@Injectable()
export class UserListener {
  constructor(
    private readonly emailMessenger: EmailMessengerService,
    private readonly userService: UserService,
  ) {}

  @OnEvent(USER_CREATED_EVENT_NAME)
  async handleUserCreated(event: UserCreatedEvent) {
    const { user, otp } = event;
    await this.emailMessenger.sendOTP({
      otp,
      user,
      type: OTPType.EMAIL_VERIFICATION,
    });
  }

  @OnEvent(USER_DELETED_EVENT_NAME)
  async handleUserDeleted(event: UserDeletedEvent) {
    const { user } = event;
    // TODO: appropiate action
    // e.g: email the user and/or admin.
    console.log('New User account deleted', {
      user,
    });
  }

  @OnEvent(MEDIA_CREATED_EVENT_NAME)
  async handleEventDeleted(event: MediaCreatedEvent) {
    const media = event.media;
    if (media.type !== MediaTypeEnum.USER_PHOTO) {
      return;
    }

    await this.userService.update(media.ref._id.toString(), {
      media: media._id,
    });
  }
}
