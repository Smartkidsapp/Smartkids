import { OTPType } from 'src/app/tokens/schemas/otp.schema';
import { UserRoleEnum } from 'src/app/users/schemas/users.schema';

export interface FullTokenPayload {
  sub: string;
  role: UserRoleEnum;
  ok: boolean;
}

export interface OTPTokenPayload {
  sub: OTPType;
  email: string;
}

export type JwtTokenPayload = FullTokenPayload | OTPTokenPayload;
