import { UserDocument } from '../schemas/users.schema';

export const USER_CREATED_EVENT_NAME = 'users::created';

export class UserCreatedEvent {
  user: UserDocument;
  otp: string;

  constructor(user: UserDocument, otp: string) {
    this.user = user;
    this.otp = otp;
  }
}
