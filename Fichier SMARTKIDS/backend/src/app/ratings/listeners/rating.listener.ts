import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EmailMessengerService } from 'src/app/messenger/email-messenger.service';
import { RatingDocument } from '../schemas/rating.schema';
import { UserDocument } from 'src/app/users/schemas/users.schema';

export const RATING_CREATED_EVENT_NAME = 'rating:create';

export class RatingCreatedEvent {
  constructor(
    public rating: RatingDocument,
    public author: UserDocument,
    public subject: UserDocument,
  ) {}
}

@Injectable()
export class RatingListener {
  constructor(private readonly emailMessenger: EmailMessengerService) {}

  @OnEvent(RATING_CREATED_EVENT_NAME)
  async handleUserCreated(event: RatingCreatedEvent) {
    const { rating, subject, author } = event;

    console.log(RATING_CREATED_EVENT_NAME, { rating, subject, author });
  }
}
