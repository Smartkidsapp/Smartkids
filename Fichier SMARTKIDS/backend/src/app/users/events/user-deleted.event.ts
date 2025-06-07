import { UserDocument } from '../schemas/users.schema';

export const USER_DELETED_EVENT_NAME = 'users::delted';

export class UserDeletedEvent {
  user: UserDocument;

  constructor(user: UserDocument) {
    this.user = user;
  }
}
