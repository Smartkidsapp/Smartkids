import { UserDocument } from 'src/app/users/schemas/users.schema';
import { OTPType } from '../schemas/otp.schema';

export const OTP_CREATED_EVENT_NAME = 'token::otp-created';

export class OTPCreatedEvent {
  user: UserDocument;
  type: OTPType;
  otp: string;

  constructor(user: UserDocument, type: OTPType, otp: string) {
    this.user = user;
    this.type = type;
    this.otp = otp;
  }
}
